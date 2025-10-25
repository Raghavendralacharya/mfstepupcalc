class MutualFundCalculator {
    constructor() {
        this.form = document.getElementById('calculatorForm');
        this.resultsSection = document.getElementById('resultsSection');
        this.growthChart = null;
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculate();
        });

        // Add input validation and real-time updates
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateInput(input);
            });
        });
    }

    validateInput(input) {
        const value = parseFloat(input.value);
        const min = parseFloat(input.min) || 0;
        const max = parseFloat(input.max) || Infinity;

        if (value < min) {
            input.value = min;
        } else if (value > max) {
            input.value = max;
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatNumber(number) {
        return new Intl.NumberFormat('en-IN').format(number);
    }

    calculate() {
        try {
            // Get input values
            const initialLumpSum = parseFloat(document.getElementById('initialLumpSum').value) || 0;
            const initialSIP = parseFloat(document.getElementById('initialSIP').value) || 0;
            const stepUpPercentage = parseFloat(document.getElementById('stepUpPercentage').value) || 0;
            const stepUpFrequency = parseInt(document.getElementById('stepUpFrequency').value) || 12;
            const investmentTenure = parseInt(document.getElementById('investmentTenure').value) || 1;
            const expectedReturns = parseFloat(document.getElementById('expectedReturns').value) || 0;

            // Validate inputs
            if (initialSIP <= 0 && initialLumpSum <= 0) {
                alert('Please enter at least one investment amount (SIP or Lump Sum)');
                return;
            }

            if (investmentTenure <= 0) {
                alert('Investment tenure must be greater than 0');
                return;
            }

            // Calculate results
            const results = this.calculateStepUpSIP(
                initialLumpSum,
                initialSIP,
                stepUpPercentage,
                stepUpFrequency,
                investmentTenure,
                expectedReturns
            );

            // Display results
            this.displayResults(results);
            this.showResultsSection();

        } catch (error) {
            console.error('Calculation error:', error);
            alert('An error occurred during calculation. Please check your inputs.');
        }
    }

    calculateStepUpSIP(initialLumpSum, initialSIP, stepUpPercentage, stepUpFrequency, tenure, expectedReturns) {
        const monthlyRate = expectedReturns / 100 / 12;
        const totalMonths = tenure * 12;
        
        let totalSIPInvestment = 0;
        let totalSIPValue = 0;
        let currentSIPAmount = initialSIP;
        let yearlyData = [];
        
        // Calculate lump sum value
        const lumpSumValue = initialLumpSum * Math.pow(1 + expectedReturns / 100, tenure);
        const lumpSumReturns = lumpSumValue - initialLumpSum;

        // Calculate SIP with step-up
        for (let year = 1; year <= tenure; year++) {
            let yearSIPInvestment = 0;
            let yearSIPValue = 0;
            
            // Apply step-up at the beginning of each year (except first year)
            if (year > 1) {
                currentSIPAmount = currentSIPAmount * (1 + stepUpPercentage / 100);
            }
            
            for (let month = 1; month <= 12; month++) {
                const monthNumber = (year - 1) * 12 + month;
                
                // Calculate SIP investment and value
                yearSIPInvestment += currentSIPAmount;
                totalSIPInvestment += currentSIPAmount;
                
                // Calculate future value of this month's SIP
                const monthsRemaining = totalMonths - monthNumber + 1;
                const futureValue = currentSIPAmount * Math.pow(1 + monthlyRate, monthsRemaining);
                yearSIPValue += futureValue;
                totalSIPValue += futureValue;
            }
            
            // Calculate the value of lump sum at the end of this year
            const lumpSumValueAtYearEnd = initialLumpSum * Math.pow(1 + expectedReturns / 100, year);
            
            // Calculate the value of all SIP investments made so far at the end of this year
            let sipValueAtYearEnd = 0;
            let tempSIPAmount = initialSIP;
            let tempSIPInvestment = 0;
            
            for (let tempYear = 1; tempYear <= year; tempYear++) {
                // Apply step-up at the beginning of each year (except first year)
                if (tempYear > 1) {
                    tempSIPAmount = tempSIPAmount * (1 + stepUpPercentage / 100);
                }
                
                for (let tempMonth = 1; tempMonth <= 12; tempMonth++) {
                    const tempMonthNumber = (tempYear - 1) * 12 + tempMonth;
                    
                    tempSIPInvestment += tempSIPAmount;
                    
                    // Calculate value of this SIP at the end of the current year
                    const monthsFromInvestment = (year * 12) - tempMonthNumber + 1;
                    const sipValueForThisMonth = tempSIPAmount * Math.pow(1 + monthlyRate, monthsFromInvestment);
                    sipValueAtYearEnd += sipValueForThisMonth;
                }
            }
            
            const totalInvestmentAtYearEnd = initialLumpSum + tempSIPInvestment;
            const totalValueAtYearEnd = lumpSumValueAtYearEnd + sipValueAtYearEnd;
            const returnsAtYearEnd = totalValueAtYearEnd - totalInvestmentAtYearEnd;
            
            yearlyData.push({
                year: year,
                annualSIP: yearSIPInvestment,
                cumulativeInvestment: totalInvestmentAtYearEnd,
                investmentValue: totalValueAtYearEnd,
                returns: returnsAtYearEnd
            });
        }

        const totalInvestment = initialLumpSum + totalSIPInvestment;
        const finalValue = lumpSumValue + totalSIPValue;
        const totalReturns = finalValue - totalInvestment;
        const returnPercentage = (totalReturns / totalInvestment) * 100;


        return {
            initialLumpSum,
            totalSIPInvestment,
            lumpSumValue,
            totalSIPValue,
            lumpSumReturns,
            totalSIPReturns: totalSIPValue - totalSIPInvestment,
            totalInvestment,
            finalValue,
            totalReturns,
            returnPercentage,
            yearlyData
        };
    }

    displayResults(results) {
        // Validate results
        if (!results || typeof results.totalInvestment === 'undefined') {
            console.error('Invalid results object:', results);
            alert('Error: Invalid calculation results');
            return;
        }

        // Update key metrics (highlighted)
        document.getElementById('finalValueHighlight').textContent = this.formatCurrency(results.finalValue);
        document.getElementById('totalReturnsHighlight').textContent = this.formatCurrency(results.totalReturns);

        // Update summary cards
        document.getElementById('totalInvestment').textContent = this.formatCurrency(results.totalInvestment);
        document.getElementById('finalValue').textContent = this.formatCurrency(results.finalValue);
        document.getElementById('totalReturns').textContent = this.formatCurrency(results.totalReturns);
        document.getElementById('returnPercentage').textContent = `${results.returnPercentage.toFixed(2)}%`;

        // Update breakdown cards
        document.getElementById('lumpSumInvestment').textContent = this.formatCurrency(results.initialLumpSum);
        document.getElementById('sipInvestment').textContent = this.formatCurrency(results.totalSIPInvestment);
        document.getElementById('lumpSumReturns').textContent = this.formatCurrency(results.lumpSumReturns);
        document.getElementById('sipReturns').textContent = this.formatCurrency(results.totalSIPReturns);

        // Update yearly breakdown table
        this.updateYearlyTable(results.yearlyData);

        // Update chart
        this.updateChart(results.yearlyData);
    }

    updateYearlyTable(yearlyData) {
        const tbody = document.getElementById('yearlyTableBody');
        tbody.innerHTML = '';

        yearlyData.forEach(data => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.year}</td>
                <td>${this.formatCurrency(data.annualSIP)}</td>
                <td>${this.formatCurrency(data.cumulativeInvestment)}</td>
                <td>${this.formatCurrency(data.investmentValue)}</td>
                <td>${this.formatCurrency(data.returns)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    updateChart(yearlyData) {
        const ctx = document.getElementById('growthChart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.growthChart) {
            this.growthChart.destroy();
        }

        const labels = yearlyData.map(data => `Year ${data.year}`);
        const investmentData = yearlyData.map(data => data.cumulativeInvestment);
        const valueData = yearlyData.map(data => data.investmentValue);

        this.growthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Investment',
                        data: investmentData,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Investment Value',
                        data: valueData,
                        borderColor: '#764ba2',
                        backgroundColor: 'rgba(118, 75, 162, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const value = new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0
                                }).format(context.parsed.y);
                                return `${context.dataset.label}: ${value}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Years',
                            font: {
                                weight: '600'
                            }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Amount (₹)',
                            font: {
                                weight: '600'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0
                                }).format(value);
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    showResultsSection() {
        this.resultsSection.style.display = 'block';
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Add success animation
        this.resultsSection.classList.add('success-animation');
        setTimeout(() => {
            this.resultsSection.classList.remove('success-animation');
        }, 600);
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MutualFundCalculator();
});

// Add some helpful tooltips and examples
document.addEventListener('DOMContentLoaded', () => {
    // Add placeholder examples
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            if (!input.value) {
                switch(input.id) {
                    case 'initialLumpSum':
                        input.placeholder = 'e.g., 100000';
                        break;
                    case 'initialSIP':
                        input.placeholder = 'e.g., 5000';
                        break;
                    case 'stepUpPercentage':
                        input.placeholder = 'e.g., 10 (10% increase)';
                        break;
                    case 'investmentTenure':
                        input.placeholder = 'e.g., 10 years';
                        break;
                    case 'expectedReturns':
                        input.placeholder = 'e.g., 12 (12% annual)';
                        break;
                }
            }
        });
    });
});
