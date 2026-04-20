const getProfitPerChicken = () => {
  const stats: any = {};

  eggsData.forEach((e) => {
    if (!e.chicken_id) return;

    if (!stats[e.chicken_id]) stats[e.chicken_id] = 0;
    stats[e.chicken_id] += e.count;
  });

  const chickenCount = chickens.length || 1;
  const totalFeedCost = totalFeed * Number(feedCost || 0);
  const feedPerChicken = totalFeedCost / chickenCount;

  return chickens.map((c) => {
    const eggs = stats[c.id] || 0;
    const income = eggs * Number(eggPrice || 0);
    const profit = income - feedPerChicken;

    return {
      name: c.name,
      eggs,
      income,
      cost: feedPerChicken,
      profit
    };
  });
};