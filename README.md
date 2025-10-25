# Mutual Fund Step-Up Calculator

link to website - https://sip-planner-five.vercel.app/

A modern, responsive web application for calculating mutual fund investments with step-up SIP and initial lump sum features.

## Features

### 🎯 Core Calculator Features
- **Initial Lump Sum Investment**: Add a one-time investment at the beginning
- **Step-Up SIP**: Automatically increase SIP amount at regular intervals
- **Flexible Step-Up Frequency**: Monthly, Quarterly, Half-Yearly, or Yearly
- **Customizable Parameters**: Investment tenure, expected returns, step-up percentage

### 📊 Comprehensive Analysis
- **Investment Summary**: Total investment, final value, returns, and return percentage
- **Detailed Breakdown**: Separate analysis for lump sum and SIP investments
- **Interactive Charts**: Visual representation of investment growth over time
- **Yearly Breakdown Table**: Month-by-month investment tracking

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Gradient Design**: Modern color scheme with smooth animations
- **Real-time Validation**: Input validation with helpful placeholders
- **Smooth Animations**: Success animations and hover effects

## How to Use

1. **Open the Calculator**: Open `index.html` in your web browser
2. **Enter Investment Details**:
   - **Initial Lump Sum**: One-time investment amount (optional)
   - **Initial SIP**: Starting monthly SIP amount
   - **Step-Up Percentage**: How much to increase SIP (e.g., 10% = 10% increase)
   - **Step-Up Frequency**: How often to increase SIP
   - **Investment Tenure**: Total investment period in years
   - **Expected Returns**: Annual expected returns percentage

3. **Click Calculate**: View comprehensive results and analysis

## Example Scenarios

### Scenario 1: Conservative Investor
- Initial Lump Sum: ₹1,00,000
- Initial SIP: ₹5,000
- Step-Up: 5% annually
- Tenure: 15 years
- Expected Returns: 10%

### Scenario 2: Aggressive Investor
- Initial Lump Sum: ₹2,50,000
- Initial SIP: ₹10,000
- Step-Up: 15% annually
- Tenure: 20 years
- Expected Returns: 15%

## Technical Details

### Files Structure
```
mfstepupcalc/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript calculator logic
└── README.md           # This file
```

### Technologies Used
- **HTML5**: Semantic markup and form structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Calculator logic and DOM manipulation
- **Chart.js**: Interactive charts for data visualization
- **Google Fonts**: Inter font family for modern typography

### Key Features Implementation
- **Step-Up Logic**: Calculates SIP increases at specified intervals
- **Compound Interest**: Accurate calculation of future values
- **Currency Formatting**: Indian Rupee formatting with proper locale
- **Responsive Charts**: Interactive charts that work on all devices
- **Input Validation**: Real-time validation and error handling

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Future Enhancements
- [ ] Tax calculation (LTCG, STCG)
- [ ] Goal-based planning
- [ ] Multiple fund comparison
- [ ] Export to PDF functionality
- [ ] Dark mode toggle
- [ ] Investment recommendations

## License
This project is open source and available under the MIT License.
