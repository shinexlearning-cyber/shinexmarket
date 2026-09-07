import { api } from './client';

export async function getPlans() {
  const res = await api.get('/subscriptions/plans', ).catch(() => null);
  return res?.data;
}
export async function getMyPlan() {
  const res = await api.get('/subscriptions/me');
  return res.data; // { plan, plan_expires_at }
}
export async function startSubscription(plan) {
  const res = await api.post('/subscriptions', { plan });
  return res.data; // { subscription, authorization_url, reference }
}
export async function verifySubscription(reference) {
  const res = await api.get(`/subscriptions/verify/${reference}`);
  return res.data;
}
