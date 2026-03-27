'use client';

import { useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import '../../../styles/components/ui/TextType.css';

/**
 * Componente que simula el efecto de escritura (typing effect).
 * @param {Object} props - Propiedades del componente.
 * @param {string|string[]} props.text - Texto o array de textos a escribir.
 * @param {React.ElementType} [props.as='div'] - Elemento HTML o componente a renderizar como contenedor.
 * @param {number} [props.typingSpeed=50] - Velocidad de escritura en ms.
 * @param {number} [props.initialDelay=0] - Retraso antes de empezar a escribir en ms.
 * @param {number} [props.pauseDuration=2000] - Tiempo de espera al terminar una frase en ms.
 * @param {number} [props.deletingSpeed=30] - Velocidad de borrado en ms.
 * @param {boolean} [props.loop=true] - Si debe repetirse el ciclo indefinidamente.
 * @param {string} [props.className=''] - Clase CSS adicional para el contenedor.
 * @param {boolean} [props.showCursor=true] - Si se debe mostrar el cursor parpadeante.
 * @param {string} [props.cursorCharacter='|'] - Carácter a usar como cursor.
 * @param {string[]} [props.textColors=[]] - Array de colores para cada frase.
 * @param {boolean} [props.startOnVisible=false] - Si debe empezar solo cuando sea visible en el viewport.
 */
const TextType = ({
    text,
    as: Component = 'div',
    typingSpeed = 50,
    initialDelay = 0,
    pauseDuration = 2000,
    deletingSpeed = 30,
    loop = true,
    className = '',
    showCursor = true,
    hideCursorWhileTyping = false,
    cursorCharacter = '|',
    cursorClassName = '',
    cursorBlinkDuration = 0.5,
    textColors = [],
    variableSpeed,
    onSentenceComplete,
    startOnVisible = false,
    reverseMode = false,
    ...props
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(!startOnVisible);
    const cursorRef = useRef(null);
    const containerRef = useRef(null);

    const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

    const getRandomSpeed = useCallback(() => {
        if (!variableSpeed) return typingSpeed;
        const { min, max } = variableSpeed;
        return Math.random() * (max - min) + min;
    }, [variableSpeed, typingSpeed]);

    const getCurrentTextColor = () => {
        if (textColors.length === 0) return;
        return textColors[currentTextIndex % textColors.length];
    };

    // --- Efecto: Observador de Intersección ---
    // Inicia la animación solo cuando el componente entra en el campo de visión del usuario.
    useEffect(() => {
        if (!startOnVisible || !containerRef.current) return;

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 } // Se activa cuando el 10% del componente es visible
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [startOnVisible]);

    // --- Efecto: Animación del Cursor ---
    // Utiliza GSAP para crear un efecto de parpadeo suave en el cursor.
    useEffect(() => {
        if (showCursor && cursorRef.current) {
            gsap.set(cursorRef.current, { opacity: 1 });
            gsap.to(cursorRef.current, {
                opacity: 0,
                duration: cursorBlinkDuration,
                repeat: -1,
                yoyo: true, // Efecto rebote (opacidad 1 -> 0 -> 1)
                ease: 'power2.inOut'
            });
        }
    }, [showCursor, cursorBlinkDuration]);

    useEffect(() => {
        if (!isVisible) return;

        let timeout;
        const currentText = textArray[currentTextIndex];
        if (!currentText) return;

        const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;

        /**
         * Lógica recursiva que maneja tanto la escritura como el borrado de caracteres.
         */
        const executeTypingAnimation = () => {
            if (isDeleting) {
                // --- MODO BORRADO ---
                if (displayedText === '') {
                    // Si ya se borró todo, pasamos a la siguiente frase (o terminamos)
                    setIsDeleting(false);
                    if (currentTextIndex === textArray.length - 1 && !loop) {
                        return;
                    }

                    if (onSentenceComplete) {
                        onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
                    }

                    setCurrentTextIndex(prev => (prev + 1) % textArray.length);
                    setCurrentCharIndex(0);
                    timeout = setTimeout(() => { }, pauseDuration);
                } else {
                    // Borrar el último carácter
                    timeout = setTimeout(() => {
                        setDisplayedText(prev => prev.slice(0, -1));
                    }, deletingSpeed);
                }
            } else {
                // --- MODO ESCRITURA ---
                if (currentCharIndex < processedText.length) {
                    // Escribir el siguiente carácter
                    timeout = setTimeout(
                        () => {
                            setDisplayedText(prev => prev + processedText[currentCharIndex]);
                            setCurrentCharIndex(prev => prev + 1);
                        },
                        variableSpeed ? getRandomSpeed() : typingSpeed
                    );
                } else if (textArray.length >= 1) {
                    // Frase completada, esperar antes de empezar a borrar
                    if (!loop && currentTextIndex === textArray.length - 1) return;
                    timeout = setTimeout(() => {
                        setIsDeleting(true);
                    }, pauseDuration);
                }
            }
        };

        if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
            timeout = setTimeout(executeTypingAnimation, initialDelay);
        } else {
            executeTypingAnimation();
        }

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentCharIndex,
        displayedText,
        isDeleting,
        typingSpeed,
        deletingSpeed,
        pauseDuration,
        textArray,
        currentTextIndex,
        loop,
        initialDelay,
        isVisible,
        reverseMode,
        variableSpeed,
        onSentenceComplete
    ]);

    const currentTextSafe = textArray[currentTextIndex] || "";
    const shouldHideCursor =
        hideCursorWhileTyping && (currentCharIndex < currentTextSafe.length || isDeleting);

    return createElement(
        Component,
        {
            ref: containerRef,
            className: `text-type ${className}`,
            ...props
        },
        <span className="text-type__content" style={{ color: getCurrentTextColor() || 'inherit' }}>
            {displayedText}
        </span>,
        showCursor && (
            <span
                ref={cursorRef}
                className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}
            >
                {cursorCharacter}
            </span>
        )
    );
};

export default TextType;
