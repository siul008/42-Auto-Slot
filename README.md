# 42-Auto-Slot
A simple Js program that allows you to automatically book slot for the day in a given hour range

Sometimes especially on quieter days finding a correction slot can be cumbersome due to the need to refresh the page, scroll, check if a slot is available etc...<br />
With 42-Auto-Slot, you can automate the process and book the right slot without the hassle.

A simple JavaScript script that automatically books a slot for your 42 project within a given hour range.

## How to use
1. Go to your project page on the 42 Intra.
2. Navigate to the "Subscribe to defense" section where slots are available.
3. Open your browser’s developer console (F12 or Ctrl+Shift+I).
4. Paste the JavaScript code into the console and press Enter.
5. You'll be prompted for:
- Min hour: The earliest hour you’re willing to accept (e.g., 15 for 3 PM).
- Max hour (inclusive): The latest hour you’re willing to accept (e.g., 17 for 5 PM).
 For example, entering 15 for both min and max will only accept slots from 15:00 to 15:59.
6. Confirm that you want to start the auto-booking process.

Once launched, the script will:
- Check for available slots every 5 seconds.
- Automatically book a slot that matches your criteria.
- Display a message in the console after a success booking
- Stop running once a slot is successfully booked.

To cancel the script at any time, just refresh or leave the page.

### Prerequiste 
Depending on your browser option, pasting code in the console might be disabled by default, you'll need to either modify your browser option to let you paste it everytime without warnings or follow the instructions (usually typing allow pasting in the console)
