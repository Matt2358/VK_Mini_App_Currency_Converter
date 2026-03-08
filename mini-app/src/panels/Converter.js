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
  CHF: { title: 'Швейцарский франк', rate: null },
  JPY: { title: 'Японская иена', rate: null },
  BYN: { title: 'Белорусский рубль', rate: null },
  UAH: { title: 'Украинская гривна', rate: null },
  KZT: { title: 'Казахстанский тенге', rate: null },
  AMD: { title: 'Армянский драм', rate: null },
  AZN: { title: 'Азербайджанский манат', rate: null },
  GEL: { title: 'Грузинский лари', rate: null },
  KGS: { title: 'Киргизский сом', rate: null },
  TJS: { title: 'Таджикский сомони', rate: null },
  UZS: { title: 'Узбекский сум', rate: null },
  MDL: { title: 'Молдавский лей', rate: null },
  TMT: { title: 'Новый туркменский манат', rate: null },
  DKK: { title: 'Датская крона', rate: null },
  NOK: { title: 'Норвежская крона', rate: null },
  SEK: { title: 'Шведская крона', rate: null },
  CZK: { title: 'Чешская крона', rate: null },
  HUF: { title: 'Венгерский форинт', rate: null },
  PLN: { title: 'Польский злотый', rate: null },
  RON: { title: 'Румынский лей', rate: null },
  BGN: { title: 'Болгарский лев', rate: null },
  RSD: { title: 'Сербский динар', rate: null },
  HRK: { title: 'Хорватская куна', rate: null },
  ISK: { title: 'Исландская крона', rate: null },
  KRW: { title: 'Южнокорейская вона', rate: null },
  SGD: { title: 'Сингапурский доллар', rate: null },
  HKD: { title: 'Гонконгский доллар', rate: null },
  MYR: { title: 'Малайзийский ринггит', rate: null },
  IDR: { title: 'Индонезийская рупия', rate: null },
  PHP: { title: 'Филиппинское песо', rate: null },
  THB: { title: 'Тайский бат', rate: null },
  VND: { title: 'Вьетнамский донг', rate: null },
  INR: { title: 'Индийская рупия', rate: null },
  PKR: { title: 'Пакистанская рупия', rate: null },
  ILS: { title: 'Израильский шекель', rate: null },
  SAR: { title: 'Саудовский риял', rate: null },
  AED: { title: 'Дирхам ОАЭ', rate: null },
  KWD: { title: 'Кувейтский динар', rate: null },
  IRR: { title: 'Иранский риал', rate: null },
  QAR: { title: 'Катарский риал', rate: null },
  OMR: { title: 'Оманский риал', rate: null },
  BHD: { title: 'Бахрейнский динар', rate: null },
  MMK: { title: 'Кьят (Мьянма)', rate: null },
  MNT: { title: 'Тугрик (Монголия)', rate: null },
  BDT: { title: 'Така (Бангладеш)', rate: null },
  LKR: { title: 'Шри-Ланкийская рупия', rate: null },
  ZAR: { title: 'Южноафриканский рэнд', rate: null },
  EGP: { title: 'Египетский фунт', rate: null },
  NGN: { title: 'Нигерийская найра', rate: null },
  DZD: { title: 'Алжирский динар', rate: null },
  ETB: { title: 'Эфиопский быр', rate: null },
  TRY: { title: 'Турецкая лира', rate: null },
  BRL: { title: 'Бразильский реал', rate: null },
  MXN: { title: 'Мексиканское песо', rate: null },
  ARS: { title: 'Аргентинское песо', rate: null },
  COP: { title: 'Колумбийское песо', rate: null },
  CUP: { title: 'Кубинское песо', rate: null },
  BOB: { title: 'Боливийский боливиано', rate: null },
};

// Запасные курсы (на случай ошибки API)
const FALLBACK_RATES = {
  USD: 90,
  EUR: 100,
  CNY: 12,
  GBP: 115,
  CHF: 105,
  JPY: 0.6,
  BYN: 28,
  UAH: 2.4,
  KZT: 0.2,
  AMD: 0.23,
  AZN: 53,
  GEL: 33,
  KGS: 1.05,
  TJS: 8.3,
  UZS: 0.0073,
  MDL: 5.1,
  TMT: 25.7,
  DKK: 13.2,
  NOK: 8.8,
  SEK: 8.9,
  CZK: 3.9,
  HUF: 0.25,
  PLN: 22,
  RON: 20,
  BGN: 51,
  RSD: 0.85,
  HRK: 13.3,
  ISK: 0.66,
  KRW: 0.068,
  SGD: 67,
  HKD: 11.5,
  MYR: 19,
  IDR: 0.0058,
  PHP: 1.6,
  THB: 2.5,
  VND: 0.0037,
  INR: 1.08,
  PKR: 0.32,
  ILS: 25,
  SAR: 24,
  AED: 24.5,
  KWD: 295,
  IRR: 0.0021,
  QAR: 24.7,
  OMR: 234,
  BHD: 239,
  MMK: 0.043,
  MNT: 0.026,
  BDT: 0.82,
  LKR: 0.30,
  ZAR: 4.9,
  EGP: 1.85,
  NGN: 0.06,
  DZD: 0.67,
  ETB: 1.6,
  TRY: 2.8,
  BRL: 18,
  MXN: 5.2,
  ARS: 0.10,
  COP: 0.022,
  CUP: 3.75,
  BOB: 13,
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