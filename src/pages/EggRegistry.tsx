const deleteEggLog = async (id: any) => {
  const confirmed = confirm("Delete this egg production log?");
  if (!confirmed) return;

  const { data, error } = await supabase
    .from("egg_logs")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    console.error("Delete egg log error:", error);
    alert("Could not delete egg production log.");
    return;
  }

  if (!data || data.length === 0) {
    alert("No egg log was deleted. Please check that the egg_logs table has an id column.");
    return;
  }

  setEggLogs((prev) =>
    prev.filter((log) => String(log.id) !== String(id))
  );

  await loadEggLogs();
};