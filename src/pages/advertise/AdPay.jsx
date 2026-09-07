import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppShell from '../../components/AppShell';
import Header from '../../components/Header';
import { LoadingState, ErrorState } from '../../components/States';
import { payForAdvertisement } from '../../api/advertisements';

export default function AdPay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    payForAdvertisement(id).then(({ authorization_url }) => {
      window.location.href = authorization_url;
    }).catch((err) => setError(err.message || 'Could not start payment'));
  }, [id]);

  return (
    <AppShell nav={false}>
      <Header title="Payment" />
      {error ? <ErrorState title="Payment couldn't start" description={error} onRetry={() => navigate(0)} /> : <LoadingState label="Redirecting you to secure payment…" />}
    </AppShell>
  );
}
