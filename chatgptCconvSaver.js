(function() {
    const conversation = [];
    const chatMessages = document.querySelectorAll("div[data-message-author-role]");
    
    console.log(`Found ${chatMessages.length} chat messages`);

    chatMessages.forEach((msg, index) => {
        const role = msg.getAttribute('data-message-author-role');
        let textElement = msg.querySelector("div.relative div");
        if (!textElement) {
            textElement = msg.querySelector("div.markdown.prose.w-full.break-words");
        }

        if (role && textElement) {
            const user = role === 'user' ? 'User' : 'Assistant';
            let text = textElement.innerText.trim();

            // Handle code blocks and inline code separately
            textElement.querySelectorAll("pre").forEach(preElem => {
                const codeText = preElem.innerText;
                text = text.replace(codeText, `\`\`\`\n${codeText}\n\`\`\``);
            });

            textElement.querySelectorAll("code").forEach(codeElem => {
                const codeText = codeElem.innerText;
                text = text.replace(codeText, `\`${codeText}\``);
            });

            conversation.push({ user, text });
            console.log(`Message ${index + 1}: ${user} - ${text}`);
        } else {
            console.log(`Message ${index + 1}: Missing role or text element`);
        }
    });

    if (conversation.length > 0) {
        let markdownContent = conversation.map(entry => `**${entry.user}:** ${entry.text}`).join('\n\n');
        const blob = new Blob([markdownContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'conversation.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        console.log('Conversation downloaded successfully as Markdown');
    } else {
        console.log('No messages found to save');
    }
})();
