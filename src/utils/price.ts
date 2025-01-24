const currencySymbols: { [key: string]: string } = {
    'TL': '₺',
    'TRY': '₺',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
};

export const formatPrice = (price: number, currency: string = 'TL'): string => {
    const symbol = currencySymbols[currency] || currency || '₺';
    if (symbol === '₺')
        return `${price.toFixed(2)} ${symbol}`;
    return `${price.toFixed(2)} ${symbol}`;
};

export const getCurrencySymbol = (currency: string): string => {
    return currencySymbols[currency] || '₺';
};

