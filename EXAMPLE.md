# Usage Examples

## Example 1: Basic Usage in Next.js

```tsx
// app/dev/icons/page.tsx
import { IconCompare } from 'react-svg-icon-compare';
import * as Icons from '@/components/icons';

export default function IconsPage() {
  return <IconCompare icons={Icons} />;
}
```

## Example 2: With Callback

```tsx
'use client';

import { IconCompare } from 'react-svg-icon-compare';
import * as Icons from '@/components/icons';
import { useState } from 'react';

export default function IconsPage() {
  const [duplicates, setDuplicates] = useState<string[]>([]);

  const handleComparison = (scores: Record<string, number>) => {
    const found = Object.entries(scores)
      .filter(([_, score]) => score > 90)
      .map(([name]) => name);
    
    setDuplicates(found);
    
    if (found.length > 0) {
      alert(`Found ${found.length} potential duplicates!`);
    }
  };

  return (
    <div>
      <IconCompare 
        icons={Icons} 
        onComparisonComplete={handleComparison}
      />
      
      {duplicates.length > 0 && (
        <div className="mt-4 p-4 bg-red-100 rounded">
          <h3>Potential Duplicates:</h3>
          <ul>
            {duplicates.map(name => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## Example 3: Custom Thresholds

```tsx
import { IconCompare } from 'react-svg-icon-compare';
import * as Icons from '@/components/icons';

export default function IconsPage() {
  return (
    <IconCompare 
      icons={Icons}
      duplicateThreshold={95}  // More strict duplicate detection
      similarThreshold={80}     // Higher threshold for similar icons
      gridColumns={10}          // More columns
    />
  );
}
```

## Example 4: Multiple Icon Sets

```tsx
import { IconCompare } from 'react-svg-icon-compare';
import * as UIIcons from '@/components/icons/ui';
import * as BrandIcons from '@/components/icons/brands';
import { useState } from 'react';

export default function IconsPage() {
  const [activeSet, setActiveSet] = useState<'ui' | 'brands'>('ui');
  
  const icons = activeSet === 'ui' ? UIIcons : BrandIcons;

  return (
    <div>
      <div className="mb-4">
        <button onClick={() => setActiveSet('ui')}>UI Icons</button>
        <button onClick={() => setActiveSet('brands')}>Brand Icons</button>
      </div>
      
      <IconCompare icons={icons} />
    </div>
  );
}
```

## Example 5: With Custom Styling

```tsx
import { IconCompare } from 'react-svg-icon-compare';
import * as Icons from '@/components/icons';

export default function IconsPage() {
  return (
    <div className="container mx-auto">
      <IconCompare 
        icons={Icons}
        className="shadow-lg rounded-lg bg-white"
        gridColumns={6}
      />
    </div>
  );
}
```

## Example 6: Programmatic Icon Loading

```tsx
'use client';

import { IconCompare } from 'react-svg-icon-compare';
import { useState, useEffect } from 'react';

export default function IconsPage() {
  const [icons, setIcons] = useState({});

  useEffect(() => {
    // Dynamically import icons
    import('@/components/icons').then((module) => {
      setIcons(module);
    });
  }, []);

  if (Object.keys(icons).length === 0) {
    return <div>Loading icons...</div>;
  }

  return <IconCompare icons={icons} />;
}
```

## Example 7: Integration with Icon Management System

```tsx
'use client';

import { IconCompare } from 'react-svg-icon-compare';
import * as Icons from '@/components/icons';
import { useState } from 'react';

export default function IconManagerPage() {
  const [stats, setStats] = useState({
    total: 0,
    duplicates: 0,
    similar: 0,
  });

  const handleComparison = (scores: Record<string, number>) => {
    const duplicateCount = Object.values(scores).filter(s => s > 90).length;
    const similarCount = Object.values(scores).filter(s => s > 70 && s <= 90).length;
    
    setStats({
      total: Object.keys(Icons).length,
      duplicates: duplicateCount,
      similar: similarCount,
    });
  };

  return (
    <div>
      <div className="stats mb-6 grid grid-cols-3 gap-4">
        <div className="stat bg-blue-100 p-4 rounded">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm">Total Icons</div>
        </div>
        <div className="stat bg-red-100 p-4 rounded">
          <div className="text-2xl font-bold">{stats.duplicates}</div>
          <div className="text-sm">Potential Duplicates</div>
        </div>
        <div className="stat bg-yellow-100 p-4 rounded">
          <div className="text-2xl font-bold">{stats.similar}</div>
          <div className="text-sm">Similar Icons</div>
        </div>
      </div>
      
      <IconCompare 
        icons={Icons}
        onComparisonComplete={handleComparison}
      />
    </div>
  );
}
```
