import { apiClient } from './apiClient.js';

export async function fetchPlans() {
  const { data } = await apiClient.get('/subscriptions/plans');
  return data.data.plans;
}

export async function fetchMySubscription() {
  const { data } = await apiClient.get('/subscriptions/me');
  return data.data; // { subscription, planDefinition }
}

export async function subscribeToPlan(payload) {
  const { data } = await apiClient.post('/subscriptions', payload);
  return data.data.subscription;
}

export async function cancelSubscription() {
  const { data } = await apiClient.post('/subscriptions/cancel');
  return data.data.subscription;
}

export async function reactivateSubscription() {
  const { data } = await apiClient.post('/subscriptions/reactivate');
  return data.data.subscription;
}
