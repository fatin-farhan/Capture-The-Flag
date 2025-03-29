document.addEventListener("DOMContentLoaded", function() {
    // Title glitch effect
    const title = document.querySelector(".title");
    setInterval(() => {
        title.classList.add("glitch");
        setTimeout(() => {
            title.classList.remove("glitch");
        }, 200);
    }, 3000);

    // Typing effect for console
    const typingLine = document.querySelector(".console-line.typing");
    if (typingLine) {
        const text = typingLine.textContent;
        typingLine.textContent = "";
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                typingLine.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        setTimeout(typeWriter, 500);
    }
});