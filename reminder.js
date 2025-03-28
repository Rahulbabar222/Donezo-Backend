import { Todo } from "./models/todo.js"; // Import your Mongoose model

const checkReminders = async () => {
    const now = new Date();
    console.log("Checking reminders at:", now);

    const reminders = await Todo.find({ reminder: { $lte: now }, isCompleted:false });

    reminders.forEach((reminder) => {
            console.log(`Reminder: ${reminder.todo} is due now!`);
    });
};
// Function to start the reminder check process
export const startReminderService = () => {
    console.log("✅ Reminder service started...");
    setInterval(checkReminders, 60 * 1000); // Run every minute
};