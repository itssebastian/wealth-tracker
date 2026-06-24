import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import { Savings, AccountBalance, Diamond, Inventory2 } from '@mui/icons-material';
import api from '../../services/api';
import PageHeader from '../../components/common/PageHeader';
import SavingsTab from './SavingsTab';
import FDTab from './FDTab';
import MetalTab from './MetalTab';

export default function WealthPage() {
  const [tab, setTab] = useState(0);
  const [savings, setSavings] = useState([]);
  const [fds, setFDs] = useState([]);
  const [gold, setGold] = useState([]);
  const [silver, setSilver] = useState([]);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, f, g, sv] = await Promise.all([
        api.get('/wealth/savings'),
        api.get('/wealth/fds'),
        api.get('/wealth/gold'),
        api.get('/wealth/silver'),
      ]);
      setSavings(s.data.data);
      setFDs(f.data.data);
      setGold(g.data.data);
      setSilver(sv.data.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const tabs = [
    { label: 'Savings', icon: <Savings fontSize="small" /> },
    { label: 'Fixed Deposits', icon: <AccountBalance fontSize="small" /> },
    { label: 'Gold', icon: <Diamond fontSize="small" /> },
    { label: 'Silver', icon: <Inventory2 fontSize="small" /> },
  ];

  return (
    <Box>
      <PageHeader title="Wealth" subtitle="Track all your assets in one place" />
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        {tabs.map((t, i) => (
          <Tooltip key={i} title={isMobile ? t.label : ''} placement="bottom">
            <Tab
              icon={t.icon}
              label={isMobile ? undefined : t.label}
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 600, minWidth: { xs: 56, sm: 'auto' } }}
            />
          </Tooltip>
        ))}
      </Tabs>
      {tab === 0 && <SavingsTab data={savings} onRefresh={fetchAll} />}
      {tab === 1 && <FDTab data={fds} onRefresh={fetchAll} />}
      {tab === 2 && <MetalTab metal="gold" data={gold} onRefresh={fetchAll} />}
      {tab === 3 && <MetalTab metal="silver" data={silver} onRefresh={fetchAll} />}
    </Box>
  );
}
