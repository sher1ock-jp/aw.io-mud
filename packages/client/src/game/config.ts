type ColorPalette = {
    grey?: string;
    green?: string;
    blue?: string;
    pink?: string;
    red?: string;
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
    // プレイヤー用の色をここで定義
    return {
        grey: '#A1A1A1',
        green: '#88F234',
        blue: '#1234AB',
        // その他の色
    };
};

export const fixedTimeStep: number = 1.0 / 30.0;
export const maxSubSteps = 3;
