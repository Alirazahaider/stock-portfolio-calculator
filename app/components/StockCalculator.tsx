'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import StockForm from './StockForm';
import StockTable from './StockTable';
import PortfolioCharts from './PortfolioCharts';
import { Stock, PortfolioSummary } from '../types/calculatorTypes';

export default function StockCalculator() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [editingStock, setEditingStock] = useState<Stock | null>(null);
    const [summary, setSummary] = useState<PortfolioSummary>({
        totalInvestment: 0,
        currentValue: 0,
        absoluteProfit: 0,
        percentageProfit: 0,
        bestPerformer: null,
        worstPerformer: null,
    });

    // Load from localStorage
    useEffect(() => {
        const savedStocks = localStorage.getItem('stocks');
        if (savedStocks) {
            try {
                const parsedStocks = JSON.parse(savedStocks);
                const stocksWithDates = parsedStocks.map((stock: any) => ({
                    ...stock,
                    purchaseDate: new Date(stock.purchaseDate),
                }));
                setStocks(stocksWithDates);
            } catch (error) {
                console.error('Failed to parse saved stocks', error);
            }
        }
    }, []);

    // Save to localStorage and calculate summary
    useEffect(() => {
        if (stocks.length > 0) {
            localStorage.setItem('stocks', JSON.stringify(stocks));
        }
        calculateSummary();
    }, [stocks]);

    const calculateSummary = () => {
        if (stocks.length === 0) {
            setSummary({
                totalInvestment: 0,
                currentValue: 0,
                absoluteProfit: 0,
                percentageProfit: 0,
                bestPerformer: null,
                worstPerformer: null,
            });
            return;
        }

        const totalInvestment = stocks.reduce(
            (sum, stock) => sum + stock.purchasePrice * stock.shares,
            0
        );
        const currentValue = stocks.reduce(
            (sum, stock) => sum + stock.currentPrice * stock.shares,
            0
        );
        const absoluteProfit = currentValue - totalInvestment;
        const percentageProfit = (absoluteProfit / totalInvestment) * 100;

        let bestPerformer: Stock | null = null;
        let worstPerformer: Stock | null = null;
        let bestPerformance = -Infinity;
        let worstPerformance = Infinity;

        stocks.forEach(stock => {
            const performance = ((stock.currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
            if (performance > bestPerformance) {
                bestPerformance = performance;
                bestPerformer = stock;
            }
            if (performance < worstPerformance) {
                worstPerformance = performance;
                worstPerformer = stock;
            }
        });

        setSummary({
            totalInvestment,
            currentValue,
            absoluteProfit,
            percentageProfit,
            bestPerformer,
            worstPerformer,
        });
    };

    const handleAddStock = (stock: Omit<Stock, 'id'>) => {
        setStocks([...stocks, { ...stock, id: uuidv4() }]);
    };

    const handleEditStock = (id: string) => {
        const stock = stocks.find(s => s.id === id);
        setEditingStock(stock || null);
    };

    const handleUpdateStock = (stock: Stock | Omit<Stock, 'id'>) => {
        if ('id' in stock) {
            // This is the update case (Stock type)
            setStocks(stocks.map(s => s.id === stock.id ? stock as Stock : s));
        } else {
            // This is the add case (Omit<Stock, 'id'>)
            setStocks([...stocks, { ...stock, id: uuidv4() }]);
        }
    };

    const handleDeleteStock = (id: string) => {
        setStocks(stocks.filter(stock => stock.id !== id));
    };

    const handleUpdatePrice = (id: string, newPrice: number) => {
        setStocks(
            stocks.map(stock =>
                stock.id === id ? { ...stock, currentPrice: newPrice } : stock
            )
        );
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Stock Portfolio Calculator</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <StockForm
                        onSubmit={editingStock ? handleUpdateStock : handleAddStock}
                        editingStock={editingStock}
                        onCancel={() => setEditingStock(null)}
                    />
                </div>
                <div className="lg:col-span-2">
                    <StockTable
                        stocks={stocks}
                        onEdit={handleEditStock}
                        onDelete={handleDeleteStock}
                        onUpdatePrice={handleUpdatePrice}
                        summary={summary}
                    />
                    {stocks.length > 0 && <PortfolioCharts stocks={stocks} />}
                </div>
            </div>
        </div>
    );
}