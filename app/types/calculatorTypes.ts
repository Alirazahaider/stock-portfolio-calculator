export type Stock = {
    id: string;
    ticker: string;
    name: string;
    purchasePrice: number;
    shares: number;
    currentPrice: number;
    purchaseDate: Date;
    notes?: string;
};

export type PortfolioSummary = {
    totalInvestment: number;
    currentValue: number;
    absoluteProfit: number;
    percentageProfit: number;
    bestPerformer: Stock | null;
    worstPerformer: Stock | null;
};

export type ChartDataPoint = {
    date: string;
    value: number;
};
