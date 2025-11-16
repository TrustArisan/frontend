'use client';

import { useState } from 'react';
import { useCreateGroup } from '../hooks/useCreateGroup';
import { parseEther } from 'ethers';

export default function CreateGroupForm() {
  const { createGroup, isPending, error } = useCreateGroup();
  const [formData, setFormData] = useState({
    title: '',
    telegramGroupUrl: '',
    coordinatorTelegramUsername: '',
    coordinatorCommissionPercentage: 10,
    contributionAmountInWei: '',
    prizePercentage: 80,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createGroup({
      ...formData,
      contributionAmountInWei: parseEther(formData.contributionAmountInWei).toString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Group Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <input
        type="url"
        placeholder="Telegram Group URL"
        value={formData.telegramGroupUrl}
        onChange={(e) => setFormData({ ...formData, telegramGroupUrl: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Coordinator Telegram Username"
        value={formData.coordinatorTelegramUsername}
        onChange={(e) => setFormData({ ...formData, coordinatorTelegramUsername: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Coordinator Commission %"
        value={formData.coordinatorCommissionPercentage}
        onChange={(e) => setFormData({ ...formData, coordinatorCommissionPercentage: parseInt(e.target.value) })}
        min="5"
        max="50"
        required
      />

      <input
        type="number"
        placeholder="Contribution Amount (ETH)"
        value={formData.contributionAmountInWei}
        onChange={(e) => setFormData({ ...formData, contributionAmountInWei: e.target.value })}
        step="0.001"
        required
      />

      <input
        type="number"
        placeholder="Prize Percentage %"
        value={formData.prizePercentage}
        onChange={(e) => setFormData({ ...formData, prizePercentage: parseInt(e.target.value) })}
        required
      />

      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-60"
      >
        {isPending ? 'Creating...' : 'Create Group'}
      </button>

      {error && <div className="text-red-600">{error.message}</div>}
    </form>
  );
}
