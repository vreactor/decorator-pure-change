/**
 * Decorator that marks a function as pure. A pure function is only executed when it detects
 * a pure change to the input value. A pure change is either a change to a primitive
 * input value (String, Number, Boolean, Symbol) or a changed object reference (Date, Array, Function, Object).
 */
 export function PureChange<T>(
    target: Object,
    propertyKey: string,
    { enumerable, value, get }: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> {
    if (typeof(value) !== 'function') {
        throw new Error(
            `[PureChange] Decorator can not be applied because the "${propertyKey}" is not a function or getter.`
        );
    }

    if (get) {
        return {
            enumerable,
            get(): T {
                const value = get.call(this);

                Object.defineProperty(this, propertyKey, { value, enumerable });

                return value;
            },
        };
    }

    const original = value;

    return {
        enumerable,
        get(): T {
            let prevResult: T;
            let prevArgs: ReadonlyArray<any> = [];

            const result = (...args: any[]) => {
                if (
                    prevArgs.length === args.length &&
                    args.every((arg, i) => arg === prevArgs[i])
                ) {
                    return prevResult;
                }

                prevResult = original.apply(this, args);
                prevArgs = args;

                return prevResult;
            };

            Object.defineProperty(this, propertyKey, {
                value: result,
            });

            return result as any;
        },
    };
}
