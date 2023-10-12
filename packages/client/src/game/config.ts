type ColorPalette = {
    grey?: string;
    green?: string;
    blue?: string;
    pink?: string;
    red?: string;
    purple?: string;
    darkBlue?: string;
    lightGreen?: string;
    charcoal?: string;
    brickRed?: string;
    teal?: string;
    slateTeal?: string;
    [key: string]: string | undefined; 
};

export const foodColors = (): ColorPalette => {
    return {
        grey: '#556270',
        green: '#C7F464',
        blue: '#4ECDC4',
        pink: '#FF6B6B',
        red: '#C44D58',
    };
};

export const playerColors = (): ColorPalette => {
    return {
        purple: '#6C5B7B',
        darkBlue: '#355C7D',
        lightGreen: '#99B898',
        charcoal: '#2A363B',
        grey: '#A8A7A7',
        brickRed: '#b45431',
        teal: '#37797b',
        slateTeal: '#547980'
    };
};

export const fixedTimeStep: number = 1.0 / 30.0;
export const maxSubSteps = 3;
