'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stock } from '../types/calculatorTypes';
import { FiX } from 'react-icons/fi';

interface StockFormProps {
    onSubmit: (stock: Stock | Omit<Stock, 'id'>) => void;
    editingStock?: Stock | null;
    onCancel?: () => void;
}

export default function StockForm({ onSubmit, editingStock, onCancel }: StockFormProps) {
    const [formData, setFormData] = useState<Omit<Stock, 'id'>>({
        ticker: '',
        name: '',
        purchasePrice: 0,
        shares: 0,
        currentPrice: 0,
        purchaseDate: new Date(),
        notes: '',
    });

    useEffect(() => {
        if (editingStock) {
            setFormData({
                ticker: editingStock.ticker,
                name: editingStock.name,
                purchasePrice: editingStock.purchasePrice,
                shares: editingStock.shares,
                currentPrice: editingStock.currentPrice,
                purchaseDate: editingStock.purchaseDate,
                notes: editingStock.notes || '',
            });
        } else {
            setFormData({
                ticker: '',
                name: '',
                purchasePrice: 0,
                shares: 0,
                currentPrice: 0,
                purchaseDate: new Date(),
                notes: '',
            });
        }
    }, [editingStock]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'purchaseDate' ? new Date(value) : value,
        }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: Number(value),
        }));
    };

    const handleTickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        const sanitized = value.replace(/[^A-Z]/g, '');
        setFormData(prev => ({
            ...prev,
            ticker: sanitized.slice(0, 5),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingStock) {
            onSubmit({ ...formData, id: editingStock.id });
        } else {
            onSubmit(formData);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md relative"
        >
            {editingStock && (
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    <FiX size={20} />
                </button>
            )}

            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                {editingStock ? 'Edit Stock' : 'Add New Stock'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Ticker Symbol
                        </label>
                        <input
                            type="text"
                            name="ticker"
                            value={formData.ticker}
                            onChange={handleTickerChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            required
                            maxLength={5}
                            pattern="[A-Z]{1,5}"
                            title="1-5 uppercase letters"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Stock Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Purchase Price ($)
                        </label>
                        <input
                            type="number"
                            name="purchasePrice"
                            value={formData.purchasePrice}
                            onChange={handleNumberChange}
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Number of Shares
                        </label>
                        <input
                            type="number"
                            name="shares"
                            value={formData.shares}
                            onChange={handleNumberChange}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Current Price ($)
                        </label>
                        <input
                            type="number"
                            name="currentPrice"
                            value={formData.currentPrice}
                            onChange={handleNumberChange}
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Purchase Date
                    </label>
                    <input
                        type="date"
                        name="purchaseDate"
                        value={formData.purchaseDate.toISOString().split('T')[0]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notes (Optional)
                    </label>
                    <input
                        type="text"
                        name="notes"
                        value={formData.notes || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                    {editingStock ? 'Update Stock' : 'Add Stock'}
                </motion.button>
            </form>
        </motion.div>
    );
}