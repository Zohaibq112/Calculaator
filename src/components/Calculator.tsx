import { useState } from 'react';
import { cn } from '@/lib/utils';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      if (newValue === null) return; // Handle division by zero

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number | null => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        if (secondValue === 0) {
          setDisplay('Error: Cannot divide by zero');
          setWaitingForNewValue(true);
          return null;
        }
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    if (previousValue !== null && operation) {
      const inputValue = parseFloat(display);
      const newValue = calculate(previousValue, inputValue, operation);
      
      if (newValue !== null) {
        setDisplay(String(newValue));
        setPreviousValue(null);
        setOperation(null);
        setWaitingForNewValue(true);
      }
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const Button = ({ 
    children, 
    onClick, 
    variant = 'number',
    className = '',
    ...props 
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'number' | 'operator' | 'equals' | 'clear';
    className?: string;
  }) => {
    const baseClasses = "h-16 rounded-2xl font-semibold text-lg transition-all duration-200 ease-smooth active:animate-button-press hover:scale-105 shadow-button";
    
    const variantClasses = {
      number: "bg-calc-number text-foreground hover:bg-calc-number/80",
      operator: "bg-gradient-primary text-primary-foreground hover:shadow-glow",
      equals: "bg-gradient-equals text-primary-foreground hover:shadow-glow",
      clear: "bg-gradient-clear text-primary-foreground hover:shadow-glow"
    };

    return (
      <button
        className={cn(baseClasses, variantClasses[variant], className)}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="bg-card p-6 rounded-3xl shadow-2xl border border-border max-w-sm w-full animate-glow-pulse">
        {/* Display */}
        <div className="bg-calc-display p-6 rounded-2xl mb-6 text-right">
          <div className="text-3xl font-mono text-foreground min-h-[3rem] flex items-center justify-end overflow-hidden">
            {display}
          </div>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* First Row */}
          <Button variant="clear" onClick={clear} className="col-span-2">
            Clear
          </Button>
          <Button variant="operator" onClick={() => inputOperation('÷')}>
            ÷
          </Button>
          <Button variant="operator" onClick={() => inputOperation('×')}>
            ×
          </Button>

          {/* Second Row */}
          <Button variant="number" onClick={() => inputNumber('7')}>
            7
          </Button>
          <Button variant="number" onClick={() => inputNumber('8')}>
            8
          </Button>
          <Button variant="number" onClick={() => inputNumber('9')}>
            9
          </Button>
          <Button variant="operator" onClick={() => inputOperation('-')}>
            -
          </Button>

          {/* Third Row */}
          <Button variant="number" onClick={() => inputNumber('4')}>
            4
          </Button>
          <Button variant="number" onClick={() => inputNumber('5')}>
            5
          </Button>
          <Button variant="number" onClick={() => inputNumber('6')}>
            6
          </Button>
          <Button variant="operator" onClick={() => inputOperation('+')}>
            +
          </Button>

          {/* Fourth Row */}
          <Button variant="number" onClick={() => inputNumber('1')}>
            1
          </Button>
          <Button variant="number" onClick={() => inputNumber('2')}>
            2
          </Button>
          <Button variant="number" onClick={() => inputNumber('3')}>
            3
          </Button>
          <Button variant="equals" onClick={performCalculation} className="row-span-2">
            =
          </Button>

          {/* Fifth Row */}
          <Button variant="number" onClick={() => inputNumber('0')} className="col-span-2">
            0
          </Button>
          <Button variant="number" onClick={inputDecimal}>
            .
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;