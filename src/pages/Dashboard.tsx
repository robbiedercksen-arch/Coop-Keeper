const handleSave = () => {
  const newChicken = {
    id: Date.now(),
    name,
    breed,
    age,
    eggs: [] // ✅ NEW
  };

  addChicken(newChicken);

  setName("");
  setBreed("");
  setAge("");
  setShowModal(false);
};