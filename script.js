// DOM 元素
const btcPriceElement = document.getElementById('btcPrice');
const changeAmountElement = document.getElementById('changeAmount');
const changePercentElement = document.getElementById('changePercent');
const priceChange24hElement = document.getElementById('priceChange24h');
const high24hElement = document.getElementById('high24h');
const low24hElement = document.getElementById('low24h');
const volume24hElement = document.getElementById('volume24h');
const lastUpdatedElement = document.getElementById('lastUpdated');
const refreshBtn = document.getElementById('refreshBtn');
const currencySelector = document.getElementById('currency');

// 货币符号映射
const currencySymbols = {
    usd: '$',
    cny: '¥',
    eur: '€',
    jpy: '¥'
};

// 当前选择的货币
let currentCurrency = 'usd';

// 获取比特币数据
async function fetchBitcoinData() {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
        const data = await response.json();
        
        return data.market_data;
    } catch (error) {
        console.error('获取比特币数据失败:', error);
        return null;
    }
}

// 更新页面数据
function updateDisplay(data) {
    if (!data) {
        btcPriceElement.textContent = '数据加载失败';
        return;
    }
    
    const currentPrice = data.current_price[currentCurrency];
    const priceChange24h = data.price_change_24h_in_currency[currentCurrency];
    const priceChangePercentage24h = data.price_change_percentage_24h_in_currency[currentCurrency];
    const high24h = data.high_24h[currentCurrency];
    const low24h = data.low_24h[currentCurrency];
    const volume24h = data.total_volume[currentCurrency];
    
    // 更新价格
    btcPriceElement.textContent = `${currencySymbols[currentCurrency]}${currentPrice.toLocaleString()}`;
    
    // 更新24小时变化
    changeAmountElement.textContent = `${priceChange24h >= 0 ? '+' : ''}${priceChange24h.toFixed(2)}`;
    changePercentElement.textContent = `(${priceChangePercentage24h >= 0 ? '+' : ''}${priceChangePercentage24h.toFixed(2)}%)`;
    
    // 设置颜色样式
    if (priceChange24h >= 0) {
        priceChange24hElement.classList.add('positive');
        priceChange24hElement.classList.remove('negative');
    } else {
        priceChange24hElement.classList.add('negative');
        priceChange24hElement.classList.remove('positive');
    }
    
    // 更新市场数据
    high24hElement.textContent = `${currencySymbols[currentCurrency]}${high24h.toLocaleString()}`;
    low24hElement.textContent = `${currencySymbols[currentCurrency]}${low24h.toLocaleString()}`;
    volume24hElement.textContent = `${currencySymbols[currentCurrency]}${volume24h.toLocaleString()}`;
    
    // 更新时间
    const now = new Date();
    lastUpdatedElement.textContent = `最后更新: ${now.toLocaleString()}`;
}

// 刷新数据
async function refreshData() {
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
    const marketData = await fetchBitcoinData();
    updateDisplay(marketData);
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> 刷新数据';
}

// 初始化
async function init() {
    // 监听货币选择变化
    currencySelector.addEventListener('change', (e) => {
        currentCurrency = e.target.value;
        refreshData();
    });
    
    // 监听刷新按钮点击
    refreshBtn.addEventListener('click', refreshData);
    
    // 初始加载数据
    await refreshData();
    
    // 每分钟自动刷新
    setInterval(refreshData, 60000);
}

// 启动应用
init();