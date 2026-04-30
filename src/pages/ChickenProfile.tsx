</label>
</div>   {/* ✅ CLOSE checkbox container FIRST */}

<div style={{ marginTop: 6 }}>
  <button onClick={() => setViewLog(log)}>View</button>
  <button onClick={() => editHealthLog(log)}>Edit</button>
  <button onClick={() => deleteHealthLog(log.id)}>Delete</button>
</div>