The issue can be solved by ensuring that any changes that cause a parent component to re-render also trigger a refetch in the child component. This could involve several strategies:

1. **Using a state variable in the parent component and passing it to the child:**  Changes to this state variable will cause the child to re-render, triggering the `useEffect` hook.
2. **Refetching on a relevant parent component's state change:** The child component will listen to a parent's state change which would indirectly trigger a re-render in the child component.
3. **Using React.memo and useCallback for optimization:** Wrap the child component with React.memo and use useCallback to prevent unnecessary re-renders that may otherwise hinder the update mechanism.

Here is an example of a solution using the parent component's state:

```javascript
// pages/parent.js
import Child from './child';

function Parent() {
  const [parentState, setParentState] = useState(false);

  return (
    <div>
      <button onClick={() => setParentState(!parentState)}>
        Trigger Re-render
      </button>
      <Child parentState={parentState} />
    </div>
  );
}

export default Parent;

// pages/child.js
import { useEffect, useState } from 'react';

function Child({ parentState }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/data');
      const json = await response.json();
      setData(json);
    };

    fetchData();
  }, [parentState]); // The dependency array now includes parentState

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Child Component</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Child;
```