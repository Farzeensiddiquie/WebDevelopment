'use client';

export default function Error({ error, reset }) {
  return (
    <div style={{ padding: 32 }}>
      <h2>Something went wrong!</h2>
      <pre>{error?.message}</pre>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
} 