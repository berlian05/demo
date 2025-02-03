const TELEGRAM_BOT_TOKEN = '7993946782:AAEgeQAdJgndQN7M7DCsmco63F3t90ITNxM';
// Замените на новый ID группы, который вы получили от @getmyid_bot
const TELEGRAM_CHAT_ID = '-1002347225027';

async function sendTelegramNotification(repair) {
    try {
        const message = formatRepairMessage(repair);
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();
        if (!data.ok) {
            throw new Error(`Telegram API Error: ${data.description}`);
        }
        
        console.log('Уведомление успешно отправлено в Telegram');
        return true;
    } catch (error) {
        console.error('Ошибка отправки уведомления:', error);
        return false;
    }
}

function formatRepairMessage(repair) {
    // Если это сообщение о завершении работ
    if (repair.messageType === 'completion') {
        return `
✅ <b>Работы завершены</b>

🏙 Город: ${repair.city}
📍 Адрес: ${repair.streets.join(', ')}, дома: ${repair.houses.join(', ')}
🔧 Тип: ${repair.isEmergency ? 'Внеплановые' : 'Плановые'} работы
⏰ Начало: ${new Date(repair.startDate).toLocaleString()}
🏁 Завершено: ${new Date(repair.completedAt).toLocaleString()}
`;
    }
    
    // Для новых работ оставляем текущий формат
    return `
🚧 <b>Новые ремонтные работы</b>

🏙 Город: ${repair.city}
📍 Адрес: ${repair.streets.join(', ')}, дома: ${repair.houses.join(', ')}
🔧 Тип: ${repair.isEmergency ? 'Внеплановые' : 'Плановые'} работы
⏰ Начало: ${new Date(repair.startDate).toLocaleString()}
${repair.endDate ? `📅 Окончание: ${new Date(repair.endDate).toLocaleString()}` : ''}
`;
}

// Функция для тестового сообщения
async function sendTestMessage() {
    const testRepair = {
        city: 'Тестовый город',
        streets: ['Тестовая улица'],
        houses: ['1'],
        isEmergency: false,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        resolved: false
    };

    const result = await sendTelegramNotification(testRepair);
    if (result) {
        alert('Тестовое сообщение успешно отправлено!');
    } else {
        alert('Ошибка отправки тестового сообщения');
    }
} 