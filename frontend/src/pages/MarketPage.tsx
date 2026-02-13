import { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/common/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { getMarketPrices, convertCurrency, getMarketAnalysis } from '../services/api';
import type { CryptoPrice, ConversionResult, MarketAnalysis } from '../types';

const SYMBOLS = ['BTC', 'ETH', 'XLM', 'SOL', 'USDC', 'USDT', 'XRP'];

const CRYPTO_META: Record<string, { name: string; icon: string }> = {
  BTC: { name: 'Bitcoin', icon: '₿' },
  ETH: { name: 'Ethereum', icon: '◆' },
  XLM: { name: 'Stellar', icon: '★' },
  SOL: { name: 'Solana', icon: '◎' },
  USDC: { name: 'USD Coin', icon: '$' },
  USDT: { name: 'Tether', icon: '₮' },
  XRP: { name: 'Ripple', icon: '✕' },
};

export function MarketPage() {
  const [prices, setPrices] = useState<Record<string, CryptoPrice>>({});
  const [pricesLoading, setPricesLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Converter state
  const [convertAmount, setConvertAmount] = useState('100');
  const [convertFrom, setConvertFrom] = useState('USD');
  const [convertTo, setConvertTo] = useState('XLM');
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [convertLoading, setConvertLoading] = useState(false);

  // AI Analysis state
  const [analysisAmount, setAnalysisAmount] = useState('100');
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const fetchPrices = useCallback(async () => {
    try {
      const result = await getMarketPrices(SYMBOLS);
      setPrices(result.prices);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Failed to fetch prices:', err);
    } finally {
      setPricesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const handleConvert = async () => {
    if (!convertAmount || parseFloat(convertAmount) <= 0) return;
    try {
      setConvertLoading(true);
      const result = await convertCurrency(parseFloat(convertAmount), convertFrom, convertTo);
      setConversionResult(result);
    } catch {
      setConversionResult(null);
    } finally {
      setConvertLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!analysisAmount || parseFloat(analysisAmount) <= 0) return;
    try {
      setAnalysisLoading(true);
      const result = await getMarketAnalysis(parseFloat(analysisAmount));
      setAnalysis(result);
    } catch {
      setAnalysis(null);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const swapCurrencies = () => {
    setConvertFrom(convertTo);
    setConvertTo(convertFrom);
    setConversionResult(null);
  };

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text)' }}>
            Market Data
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>
            Live crypto prices, conversion tools, and AI-powered route analysis.
          </p>
          {lastUpdated && (
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>
              Last updated: {lastUpdated} (auto-refreshes every 30s)
            </p>
          )}
        </div>

        {/* Live Prices Grid */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={sectionLabel}>Live Prices</h2>
          {pricesLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {SYMBOLS.map((s) => (
                <div
                  key={s}
                  style={{
                    height: '100px',
                    borderRadius: '12px',
                    background: 'linear-gradient(90deg, var(--border) 25%, var(--bg) 50%, var(--border) 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {SYMBOLS.map((symbol) => {
                const price = prices[symbol];
                if (!price) return null;
                const isPositive = price.change24h >= 0;
                return (
                  <Card key={symbol} hoverable style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: 'var(--green-tint)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 700,
                        }}
                      >
                        {CRYPTO_META[symbol]?.icon || symbol[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text)' }}>{symbol}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{CRYPTO_META[symbol]?.name}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>
                      ${price.price < 1 ? price.price.toFixed(4) : price.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: isPositive ? 'var(--green)' : 'var(--error)',
                        marginTop: '4px',
                      }}
                    >
                      {isPositive ? '▲' : '▼'} {Math.abs(price.change24h).toFixed(2)}%
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Two columns: Converter + AI Analysis */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
          {/* Currency Converter */}
          <Card style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--green-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                ⇄
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>Currency Converter</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={fieldLabel}>Amount</label>
                <input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  style={inputStyle}
                  placeholder="100"
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'end' }}>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabel}>From</label>
                  <select value={convertFrom} onChange={(e) => setConvertFrom(e.target.value)} style={inputStyle}>
                    <option value="USD">USD</option>
                    {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button onClick={swapCurrencies} style={{ ...swapBtnStyle, marginBottom: '2px' }} aria-label="Swap currencies">↕</button>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabel}>To</label>
                  <select value={convertTo} onChange={(e) => setConvertTo(e.target.value)} style={inputStyle}>
                    <option value="USD">USD</option>
                    {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <Button onClick={handleConvert} loading={convertLoading} size="md">
                Convert
              </Button>
              {conversionResult && (
                <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--green-tint)', textAlign: 'center' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '20px', fontWeight: 700, color: 'var(--green)' }}>
                    {conversionResult.amount < 1
                      ? conversionResult.amount.toFixed(6)
                      : conversionResult.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                    {convertTo}
                  </span>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Rate: 1 {convertFrom} = {conversionResult.rate.toFixed(6)} {convertTo}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* AI Route Analysis */}
          <Card style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--green-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                ✦
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>AI Route Analysis</h3>
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'var(--green-tint)', color: 'var(--green)', letterSpacing: '0.5px' }}>
                GEMINI
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={fieldLabel}>Amount (USD)</label>
                <input
                  type="number"
                  value={analysisAmount}
                  onChange={(e) => setAnalysisAmount(e.target.value)}
                  style={inputStyle}
                  placeholder="100"
                />
              </div>
              <Button onClick={handleAnalyze} loading={analysisLoading} size="md">
                {analysisLoading ? 'Analyzing...' : 'Analyze Routes'}
              </Button>
            </div>

            {analysis && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--green-tint)', marginBottom: '12px', borderLeft: '4px solid var(--green)' }}>
                  <p style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 500 }}>
                    {analysis.recommendation}
                  </p>
                </div>
                {analysis.routes.map((route) => (
                  <div
                    key={route.blockchain}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                      marginBottom: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text)', textTransform: 'capitalize' }}>
                        {route.blockchain}
                      </span>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {route.reasoning}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '16px', color: 'var(--green)' }}>
                        {route.score}/100
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Fee: ${route.fees.feeUSD.toFixed(4)}
                      </div>
                    </div>
                  </div>
                ))}
                {analysis.marketConditions && (
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', fontStyle: 'italic' }}>
                    {analysis.marketConditions}
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

const sectionLabel: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '12px',
};

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  marginBottom: '4px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1.5px solid var(--border)',
  fontSize: '14px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  background: 'var(--surface)',
  color: 'var(--text)',
  transition: 'border-color 0.2s ease',
};

const swapBtnStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text)',
  fontSize: '16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};
