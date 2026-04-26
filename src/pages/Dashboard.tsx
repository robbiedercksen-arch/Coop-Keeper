const handleSave = () => {
  if (!name || !breed || !age) return;

  const newChicken = {
    id: Date.now().toString(),
    name,
    breed,
    age,
  };

  addChicken(newChicken); // 🔥 THIS updates UI instantly

  // clear form
  setName("");
  setBreed("");
  setAge("");

  setOpen(false); // close modal
};