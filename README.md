# decorator-pure-change

The PureChange decorator marks the function as pure. A pure function is only executed when it detects a pure change to the input value. A pure change is either a change to a primitive input value (String, Number, Boolean, Symbol) or a changed object reference (Date, Array, Function, Object).

## Example

```typescript
@PureChange
getTitlePure(counter: ICounter, name: string): string {
    counter.count++;

    return `[${name}] Called ${counter.count} time(s)`;
}
```

```html
<div>{{ getTitlePure(counterPure, 'getTitlePure') }}</div>
```
