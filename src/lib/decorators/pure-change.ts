/**
 * Decorator that marks a function as pure. A pure function is only executed when it detects
 * a pure change to the input value. A pure change is either a change to a primitive
 * input value (String, Number, Boolean, Symbol) or a changed object reference (Date, Array, Function, Object).
 */
 export function PureChange() {
    let counter = 0;

    const stringifyReplacer = (key: any, value: any) => {
        if (typeof value === 'function') {
            return value.name;
        }

        return value;
    };

    const patched = (original: () => void) => {
        const identifier = ++counter;
        // The function returned here gets called instead of original method.
        return function (...args: any[]) {
            const propValName = `__pureChangeValue_${identifier}__`;
            const propMapName = `__pureChangeMap_${identifier}__`;

            let returnedValue: any;

            if (!args.length) {
                if (this.hasOwnProperty(propValName)) {
                    returnedValue = this[propValName];
                } else {
                    returnedValue = original.apply(this, args);
                    Object.defineProperty(this, propValName, {
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: returnedValue,
                    });
                }
            }

            if (args.length > 0) {
                // Get or create map
                if (!this.hasOwnProperty(propMapName)) {
                    Object.defineProperty(this, propMapName, {
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: new Map<any, any>(),
                    });
                }
                const hashMap: Map<any, any> = this[propMapName];
                const hashKey = args;
                let has = false;

                for (const [key, value] of hashMap.entries()) {
                    if (key.length === args.length && args.every((arg, i) => arg === key[i])) {
                        returnedValue = value;
                        has = true;
                        break;
                    }
                }

                if (!has) {
                    returnedValue = original.apply(this, args);
                    hashMap.set(hashKey, returnedValue);
                }

                // VERSION 2
                // hashMap.forEach((value: any, key: any[]) => {
                //     if (
                //         key.length === args.length &&
                //         args.every((arg, i) => arg === key[i]) &&
                //         !has
                //     ) {
                //         returnedValue = value;
                //         has = true;
                //         return;
                //     }
                // });

                // VERSION 1
                // const hashKey =
                //     args.length > 1 ? btoa(JSON.stringify(args, stringifyReplacer)) : args[0];

                // if (hashMap.has(hashKey)) {
                //     returnedValue = hashMap.get(hashKey);
                // } else {
                //     returnedValue = original.apply(this, args);
                //     hashMap.set(hashKey, returnedValue);
                // }
            }

            return returnedValue;
        };
    };

    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        if (descriptor.value != null) {
            descriptor.value = patched(descriptor.value);
        } else if (descriptor.get != null) {
            descriptor.get = patched(descriptor.get);
        } else {
            throw new Error(
                '[PureChange] Decorator can not be applied because the "${propertyKey}" is not a method or get accessor',
            );
        }
    };
}
