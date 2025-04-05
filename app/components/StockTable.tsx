"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stock, PortfolioSummary } from '@/app/types/calculatorTypes';
import { FiEdit, FiTrash2, FiArrowUp, FiArrowDown, FiSearch } from 'react-icons/fi';

interface StockTableProps {
    stocks: Stock[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdatePrice: (id: string, newPrice: number) => void;
    summary: PortfolioSummary;
}

type SortConfig = {
    key: keyof Stock;
    direction: 'asc' | 'desc';
};

export default function StockTable({
    stocks,
    onEdit,
    onDelete,
    onUpdatePrice,
    summary,
}: StockTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: 'ticker',
        direction: 'asc',
    });
    const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
    const [newPrice, setNewPrice] = useState('');

    const handleSort = (key: keyof Stock) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedStocks = [...stocks].sort((a, b) => {
        // @ts-ignore
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        // @ts-ignore
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredStocks = sortedStocks.filter(stock =>
        stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePriceUpdate = (id: string) => {
        if (newPrice && !isNaN(parseFloat(newPrice))) {
            onUpdatePrice(id, parseFloat(newPrice));
            setEditingPriceId(null);
            setNewPrice('');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Portfolio</h2>
                <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search stocks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('ticker')}
                            >
                                <div className="flex items-center">
                                    Ticker
                                    {sortConfig.key === 'ticker' && (
                                        <span className="ml-1">
                                            {sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center">
                                    Name
                                    {sortConfig.key === 'name' && (
                                        <span className="ml-1">
                                            {sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Shares
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('purchasePrice')}
                            >
                                <div className="flex items-center">
                                    Cost Basis
                                    {sortConfig.key === 'purchasePrice' && (
                                        <span className="ml-1">
                                            {sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                                Current Price
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('currentPrice')}
                            >
                                <div className="flex items-center">
                                    Value
                                    {sortConfig.key === 'currentPrice' && (
                                        <span className="ml-1">
                                            {sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                            >
                                Profit/Loss
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredStocks.map((stock) => {
                            const costBasis = stock.purchasePrice * stock.shares;
                            const currentValue = stock.currentPrice * stock.shares;
                            const profitLoss = currentValue - costBasis;
                            const profitLossPercentage = (profitLoss / costBasis) * 100;

                            return (
                                <motion.tr
                                    key={stock.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                                    className="transition-colors duration-150"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {stock.ticker}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {stock.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {stock.shares}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        ${costBasis.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {editingPriceId === stock.id ? (
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="number"
                                                    value={newPrice}
                                                    onChange={(e) => setNewPrice(e.target.value)}
                                                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                                    step="0.01"
                                                    min="0"
                                                />
                                                <button
                                                    onClick={() => handlePriceUpdate(stock.id)}
                                                    className="text-green-600 hover:text-green-800 dark:hover:text-green-400"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingPriceId(null)}
                                                    className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                ${Number(stock.currentPrice || 0).toFixed(2)}
                                                <button
                                                    onClick={() => {
                                                        setEditingPriceId(stock.id);
                                                        setNewPrice(String(stock.currentPrice));
                                                    }}
                                                    className="ml-2 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 text-xs"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        ${currentValue.toFixed(2)}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${profitLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                            }`}
                                    >
                                        {profitLoss >= 0 ? '+' : ''}
                                        {profitLoss.toFixed(2)} ({profitLossPercentage.toFixed(2)}%)
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onEdit(stock.id)}
                                                className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                                            >
                                                <FiEdit />
                                            </button>
                                            <button
                                                onClick={() => onDelete(stock.id)}
                                                className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {filteredStocks.length === 0 && (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No stocks found. Add some stocks to get started!
                </div>
            )}

            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Investment</h3>
                        <p className="text-xl font-semibold text-gray-800 dark:text-white">
                            ${summary.totalInvestment.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Current Value</h3>
                        <p className="text-xl font-semibold text-gray-800 dark:text-white">
                            ${summary.currentValue.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Profit/Loss</h3>
                        <p
                            className={`text-xl font-semibold ${summary.absoluteProfit >= 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}
                        >
                            {summary.absoluteProfit >= 0 ? '+' : ''}
                            {summary.absoluteProfit.toFixed(2)} ({summary.percentageProfit.toFixed(2)}%)
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                            {summary.bestPerformer ? 'Best Performer' : 'No Stocks'}
                        </h3>
                        <p className="text-xl font-semibold text-gray-800 dark:text-white">
                            {summary.bestPerformer
                                ? `${summary.bestPerformer.ticker} (+${(
                                    ((summary.bestPerformer.currentPrice - summary.bestPerformer.purchasePrice) /
                                        summary.bestPerformer.purchasePrice
                                    ).toFixed(2))}%)`
                                : '--'}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}