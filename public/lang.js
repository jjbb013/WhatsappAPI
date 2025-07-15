// public/lang.js
const translations = {
    en: {
        // index.html
        'home_title': 'WhatsApp API Server',
        'home_schedule_button': 'Go to Scheduler',
        'home_logout_button': 'Logout',
        'home_status_connecting': 'Connecting to server...',
        'home_qr_scan': 'Scan this QR code with your WhatsApp mobile app.',
        'home_client_connected_title': 'Client Connected!',
        'home_api_key_save': 'Save your API Key. You will only see it once!',
        'home_copy_button': 'Copy',
        'home_copy_button_copied': 'Copied!',
        'home_usage_personal': 'Usage Example (Personal):',
        'home_usage_group': 'Usage Example (Group):',
        'home_reset_button': 'Reset WhatsApp',
        'home_reset_confirm': 'Are you sure you want to reset WhatsApp client? This will log you out and clear all session data.',
        'home_reset_success': 'WhatsApp client reset and re-initialization started. Please refresh the page to see the new QR code.',
        'home_reset_failed': 'Failed to reset WhatsApp client:',
        'home_reset_error': 'Error resetting WhatsApp client:',

        // login.html
        'login_title': 'Login - WhatsApp API',
        'login_required': 'Login Required',
        'login_password_prompt': 'Please enter the password to continue.',
        'login_password_placeholder': 'Password',
        'login_button': 'Login',
        'login_invalid_password': 'Invalid password.',

        // schedule.html
        'schedule_title': 'Schedule Tasks - WhatsApp API',
        'schedule_back_to_home': '← Back to Home',
        'schedule_new_task_title': 'Schedule a New Task',
        'schedule_cron_placeholder': 'Cron Expression (e.g., * * * * *)',
        'schedule_number_placeholder': 'Recipient Number or Group ID',
        'schedule_is_group_label': 'This is a Group ID',
        'schedule_message_placeholder': 'Message to send',
        'schedule_button': 'Schedule Task',
        'schedule_status_success': 'Task scheduled successfully!',
        'schedule_status_error': 'Error:',
        'schedule_status_unexpected_error': 'An unexpected error occurred.',
        'schedule_batch_send_title': 'Batch Send Messages',
        'schedule_batch_numbers_placeholder': 'Enter numbers or group IDs, one per line',
        'schedule_batch_is_group_label': 'This is a Group ID',
        'schedule_batch_message_placeholder': 'Message to send',
        'schedule_batch_button': 'Send Batch',
        'schedule_batch_status_empty': 'Please enter at least one number and a message.',
        'schedule_batch_status_starting': 'Starting batch send...',
        'schedule_batch_status_api_key_missing': 'API Key not found. Please go to the home page to get your key.',
        'schedule_groups_title': 'WhatsApp Groups',
        'schedule_fetch_groups_button': 'Fetch My Groups',
        'schedule_groups_prompt': 'Click "Fetch My Groups" to see your WhatsApp groups.',
        'schedule_groups_fetching': 'Fetching groups...',
        'schedule_groups_no_found': 'No groups found.',
        'schedule_copy_id_button': 'Copy ID',
        'schedule_copied_alert': 'Copied to clipboard!',
        'schedule_active_tasks_title': 'Active Tasks',
        'schedule_tasks_loading': 'Loading tasks...',
        'schedule_tasks_no_active': 'No active tasks.',
        'schedule_task_id': 'ID:',
        'schedule_task_cron': 'Cron:',
        'schedule_task_to': 'To:',
        'schedule_task_message': 'Message:',
        'schedule_task_cancel_button': 'Cancel',
        'schedule_task_cancel_confirm': 'Are you sure you want to cancel task',
        'schedule_task_cancel_failed': 'Failed to cancel task:',
        'schedule_task_cancel_error': 'Error cancelling task:',
        'schedule_image_input': 'Select Image (PNG, JPG)',
        'schedule_cron_guide_title': 'Cron Expression Guide',
        'schedule_cron_guide_intro': 'Cron expressions are strings of five or six fields separated by white space, which represent a set of times, usually used to schedule tasks.',
        'schedule_cron_guide_format': 'Format:',
        'schedule_cron_guide_fields': 'Fields:',
        'schedule_cron_guide_field_minute': 'Minute (0-59)',
        'schedule_cron_guide_field_hour': 'Hour (0-23)',
        'schedule_cron_guide_field_day_of_month': 'Day of Month (1-31)',
        'schedule_cron_guide_field_month': 'Month (1-12 or JAN-DEC)',
        'schedule_cron_guide_field_day_of_week': 'Day of Week (0-7 or SUN-SAT, 0 and 7 are Sunday)',
        'schedule_cron_guide_special_chars': 'Special Characters:',
        'schedule_cron_guide_char_asterisk': '* (asterisk): Matches every value.',
        'schedule_cron_guide_char_comma': ', (comma): Separates items in a list.',
        'schedule_cron_guide_char_dash': '- (dash): Specifies a range.',
        'schedule_cron_guide_char_slash': '/ (slash): Specifies step values.',
        'schedule_cron_guide_examples': 'Examples:',
        'schedule_cron_guide_example_every_minute': '* * * * * (Every minute)',
        'schedule_cron_guide_example_daily_8am': '0 8 * * * (Every day at 8:00 AM)',
        'schedule_cron_guide_example_monday_9am': '0 9 * * MON (Every Monday at 9:00 AM)',
        'schedule_cron_guide_example_every_5_minutes': '*/5 * * * * (Every 5 minutes)',
        'schedule_cron_guide_example_specific_days': '0 0 1,15 * * (At 00:00 on day-of-month 1 and 15)',
    },
    zh: {
        // index.html
        'home_title': 'WhatsApp API 服务器',
        'home_schedule_button': '前往定时任务',
        'home_logout_button': '退出登录',
        'home_status_connecting': '正在连接服务器...',
        'home_qr_scan': '请使用您的 WhatsApp 手机应用扫描此二维码。',
        'home_client_connected_title': '客户端已连接！',
        'home_api_key_save': '请保存您的 API Key。您只会看到一次！',
        'home_copy_button': '复制',
        'home_copy_button_copied': '已复制！',
        'home_usage_personal': '使用示例 (个人):',
        'home_usage_group': '使用示例 (群组):',
        'home_reset_button': '重置 WhatsApp',
        'home_reset_confirm': '您确定要重置 WhatsApp 客户端吗？这将使您退出登录并清除所有会话数据。',
        'home_reset_success': 'WhatsApp 客户端已重置并开始重新初始化。请刷新页面以查看新的二维码。',
        'home_reset_failed': '重置 WhatsApp 客户端失败:',
        'home_reset_error': '重置 WhatsApp 客户端时出错:',

        // login.html
        'login_title': '登录 - WhatsApp API',
        'login_required': '需要登录',
        'login_password_prompt': '请输入密码以继续。',
        'login_password_placeholder': '密码',
        'login_button': '登录',
        'login_invalid_password': '密码无效。',

        // schedule.html
        'schedule_title': '定时任务 - WhatsApp API',
        'schedule_back_to_home': '← 返回主页',
        'schedule_new_task_title': '安排新任务',
        'schedule_cron_placeholder': 'Cron 表达式 (例如: * * * * *)',
        'schedule_number_placeholder': '接收者号码或群组ID',
        'schedule_is_group_label': '这是一个群组ID',
        'schedule_message_placeholder': '要发送的消息',
        'schedule_button': '安排任务',
        'schedule_status_success': '任务安排成功！',
        'schedule_status_error': '错误:',
        'schedule_status_unexpected_error': '发生了一个意外错误。',
        'schedule_batch_send_title': '批量发送消息',
        'schedule_batch_numbers_placeholder': '输入号码或群组ID，每行一个',
        'schedule_batch_is_group_label': '这是一个群组ID',
        'schedule_batch_message_placeholder': '要发送的消息',
        'schedule_batch_button': '批量发送',
        'schedule_batch_status_empty': '请输入至少一个号码和一条消息。',
        'schedule_batch_status_starting': '开始批量发送...',
        'schedule_batch_status_api_key_missing': 'API Key 未找到。请前往主页获取您的 Key。',
        'schedule_groups_title': 'WhatsApp 群组',
        'schedule_fetch_groups_button': '获取我的群组',
        'schedule_groups_prompt': '点击“获取我的群组”查看您的 WhatsApp 群组。',
        'schedule_groups_fetching': '正在获取群组...',
        'schedule_groups_no_found': '未找到群组。',
        'schedule_copy_id_button': '复制ID',
        'schedule_copied_alert': '已复制到剪贴板！',
        'schedule_active_tasks_title': '活跃任务',
        'schedule_tasks_loading': '正在加载任务...',
        'schedule_tasks_no_active': '没有活跃任务。',
        'schedule_task_id': 'ID:',
        'schedule_task_cron': 'Cron:',
        'schedule_task_to': '发送至:',
        'schedule_task_message': '消息:',
        'schedule_task_cancel_button': '取消',
        'schedule_task_cancel_confirm': '您确定要取消任务',
        'schedule_task_cancel_failed': '取消任务失败:',
        'schedule_task_cancel_error': '取消任务时出错:',
        'schedule_image_input': '选择图片 (PNG, JPG)',
        'schedule_cron_guide_title': 'Cron 表达式指南',
        'schedule_cron_guide_intro': 'Cron 表达式是由五个或六个由空格分隔的字段组成的字符串，表示一组时间，通常用于安排任务。',
        'schedule_cron_guide_format': '格式:',
        'schedule_cron_guide_fields': '字段:',
        'schedule_cron_guide_field_minute': '分钟 (0-59)',
        'schedule_cron_guide_field_hour': '小时 (0-23)',
        'schedule_cron_guide_field_day_of_month': '月份中的日期 (1-31)',
        'schedule_cron_guide_field_month': '月份 (1-12 或 JAN-DEC)',
        'schedule_cron_guide_field_day_of_week': '星期几 (0-7 或 SUN-SAT, 0 和 7 都是星期日)',
        'schedule_cron_guide_special_chars': '特殊字符:',
        'schedule_cron_guide_char_asterisk': '* (星号): 匹配所有值。',
        'schedule_cron_guide_char_comma': ', (逗号): 分隔列表中的项。',
        'schedule_cron_guide_char_dash': '- (破折号): 指定范围。',
        'schedule_cron_guide_char_slash': '/ (斜杠): 指定步长值。',
        'schedule_cron_guide_examples': '示例:',
        'schedule_cron_guide_example_every_minute': '* * * * * (每分钟)',
        'schedule_cron_guide_example_daily_8am': '0 8 * * * (每天上午 8:00)',
        'schedule_cron_guide_example_monday_9am': '0 9 * * MON (每周一上午 9:00)',
        'schedule_cron_guide_example_every_5_minutes': '*/5 * * * * (每 5 分钟)',
        'schedule_cron_guide_example_specific_days': '0 0 1,15 * * (每月 1 日和 15 日的 00:00)',
    }
};

function setLanguage(lang) {
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    // Update specific elements that are not just textContent or placeholder
    const copyButton = document.getElementById('copy-button');
    if (copyButton) {
        copyButton.textContent = translations[lang]['home_copy_button'];
    }
    const scheduleStatus = document.getElementById('schedule-status');
    if (scheduleStatus && scheduleStatus.textContent.includes('Task scheduled successfully!')) {
        scheduleStatus.textContent = translations[lang]['schedule_status_success'];
    }
    const batchSendStatus = document.getElementById('batch-send-status');
    if (batchSendStatus && batchSendStatus.textContent.includes('Starting batch send...')) {
        batchSendStatus.textContent = translations[lang]['schedule_batch_status_starting'];
    }
    // Update alert messages if needed, though direct alerts are harder to translate dynamically.
    // For now, rely on the alert text being in the correct language when triggered.

    localStorage.setItem('lang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang') || 'en'; // Default to English
    setLanguage(savedLang);

    // Add language toggle buttons
    document.querySelectorAll('.lang-toggle-button').forEach(button => {
        button.addEventListener('click', () => {
            const newLang = button.getAttribute('data-lang');
            setLanguage(newLang);
        });
    });
});
