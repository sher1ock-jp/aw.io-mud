type ColorPalette = {
    grey?: string;
    green?: string;
    blue?: string;
    pink?: string;
    red?: string;
    [key: string]: string | undefined; 
};

export const myColors = (): ColorPalette => {
    const colArray: ColorPalette[] = [
        {
            grey: '#556270',
            green: '#C7F464',
            blue: '#4ECDC4',
            pink: '#FF6B6B',
            red: '#C44D58',
        },
    ];

    return colArray[0];
};

export const fixedTimeStep: number = 1.0 / 30.0;
export const maxSubSteps = 3;
