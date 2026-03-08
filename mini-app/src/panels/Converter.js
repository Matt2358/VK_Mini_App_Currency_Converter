import React, { useState, useEffect } from 'react';
import {
  Panel,
  PanelHeader,
  Group,
  FormItem,
  Input,
  Select,
  Button,
  Div,
  Text,
  Spinner,
  Placeholder,
} from '@vkontakte/vkui';
import { Icon28RepeatOutline } from '@vkontakte/icons';
import PropTypes from 'prop-types';

// Конфигурация валют
const CURRENCIES = {
  RUB: { title: 'Российский рубль', rate: 1 },
  USD: { title: 'Доллар США', rate: null },
  EUR: { title: 'Евро', rate: null },
  CNY: { title: 'Китайский юань', rate: null },
  GBP: { title: 'Фунт стерлингов', rate: null },
  JPY: { title: 'Японская иена', rate: null },
  TRY: { title: 'Турецкая лира', rate: null },
  KZT: { title: 'Казахстанский тенге', rate: null },
  BYN: { title: 'Белорусский рубль', rate: null },
};

// Запасные курсы (на случай ошибки API)
const FALLBACK_RATES = {
  USD: 90,
  EUR: 100,
  CNY: 12,
  GBP: 115,
  JPY: 0.6,
  TRY: 2.8,
  KZT: 0.2,
  BYN: 28,
};

export const Converter = ({ id }) => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('RUB');
  const [toCurrency, setToCurrency] = useState('USD');
  const [rates, setRates] = useState({ RUB: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  // Загрузка курсов валют
  useEffect(() => {
    fetchRates();
    // Автообновление каждый час
    const interval = setInterval(fetchRates, 3600000);
    return () => clearInterval(interval);
  }, []);
    const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      // Пробуем получить данные с API ЦБ РФ
      const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
      if (!response.ok) throw new Error('Ошибка загрузки');
      const data = await response.json();
      
      const newRates = { RUB: 1 };
      Object.entries(data.Valute).forEach(([code, item]) => {
        newRates[code] = item.Value / item.Nominal;
      });
      // Добавляем валюты, которых может не быть в ответе
      Object.keys(CURRENCIES).forEach(code => {
        if (!newRates[code] && code !== 'RUB') {
          newRates[code] = FALLBACK_RATES[code] || 1;
        }
      });
      setRates(newRates);
      setLastUpdate(new Date());
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить курсы. Используются сохранённые данные.');
      // Используем запасные курсы
      const fallbackRates = { RUB: 1 };
      Object.entries(FALLBACK_RATES).forEach(([code, rate]) => {
        fallbackRates[code] = rate;
      });
      setRates(fallbackRates);
    } finally {
      setLoading(false);
    }
  };

  // Конвертация
  const convert = () => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount === 0) return '0';
    if (!rates[fromCurrency] || !rates[toCurrency]) return '—';
    const inRUB = numAmount / rates[fromCurrency];
    return (inRUB * rates[toCurrency]).toFixed(2);
  };

  const result = convert();

  // Меняем валюты местами
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <Panel id={id}>
      <PanelHeader>Конвертер валют</PanelHeader>
      <Group>
        <FormItem top="Сумма">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />
        </FormItem>

        <FormItem top="Из">
          <Select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            options={Object.entries(CURRENCIES).map(([code, { title }]) => ({
              value: code,
              label: `${code} — ${title}`,
            }))}
          />
        </FormItem>

        <Div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            mode="secondary"
            onClick={swapCurrencies}
            before={<Icon28RepeatOutline />}
            style={{ borderRadius: '50%', width: 48, height: 48 }}
          />
        </Div>

        <FormItem top="В">
          <Select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            options={Object.entries(CURRENCIES).map(([code, { title }]) => ({
              value: code,
              label: `${code} — ${title}`,
            }))}
          />
        </FormItem>

        <Div>
          <Text weight="2" style={{ fontSize: 20, textAlign: 'center' }}>
            Результат: {loading ? 'Загрузка...' : result} {toCurrency}
          </Text>
        </Div>

        {!loading && rates[fromCurrency] && rates[toCurrency] && (
          <Div>
            <Text style={{ textAlign: 'center', color: 'var(--text_secondary)' }}>
              1 {fromCurrency} = {(rates[toCurrency] / rates[fromCurrency]).toFixed(4)} {toCurrency}
            </Text>
          </Div>
        )}

        {lastUpdate && (
          <Div>
            <Text style={{ textAlign: 'center', color: 'var(--text_tertiary)' }}>
              Обновлено: {lastUpdate.toLocaleTimeString()}
            </Text>
          </Div>
        )}

        {error && (
          <Placeholder>
            <Text style={{ color: 'var(--destructive)' }}>{error}</Text>
          </Placeholder>
        )}

        <Div>
          <Button
            size="l"
            stretched
            mode="secondary"
            onClick={fetchRates}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Обновить курсы'}
          </Button>
        </Div>
      </Group>
    </Panel>
  );
};

Converter.propTypes = {
  id: PropTypes.string.isRequired,
};