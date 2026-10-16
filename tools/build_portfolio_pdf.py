import pymupdf as fitz
import os

def build_pdf():
    # Save to the project folder alongside Souq Elmajde PDF
    output_dir = r"d:\hussein-portfolio\مشروع"
    pdf_path = os.path.join(output_dir, "Hussein_Portfolio_Platform_RUDN_Russian.pdf")
    doc = fitz.open()

    # Fonts with full Cyrillic support
    f_arial = fitz.Font(fontfile="C:/Windows/Fonts/arial.ttf")
    f_arial_bd = fitz.Font(fontfile="C:/Windows/Fonts/arialbd.ttf")
    f_calibri = fitz.Font(fontfile="C:/Windows/Fonts/calibri.ttf")
    f_calibri_bd = fitz.Font(fontfile="C:/Windows/Fonts/calibrib.ttf")

    # Colors
    c_bg_dark = (0.035, 0.045, 0.08)    # Deep cosmic background
    c_card_bg = (0.075, 0.095, 0.15)    # Slate navy panel
    c_border = (0.20, 0.26, 0.38)       # Border tone
    c_gold = (0.95, 0.77, 0.25)         # Gold accent
    c_azure = (0.25, 0.68, 0.96)        # Azure accent
    c_white = (0.98, 0.98, 0.99)
    c_gray = (0.75, 0.78, 0.86)
    c_green = (0.22, 0.82, 0.48)

    def draw_text(page, point, text, font, size, color):
        tw = fitz.TextWriter(page.rect)
        tw.append(point, text, font=font, fontsize=size)
        tw.write_text(page, color=color)

    def draw_multiline(page, start_point, text, font, size, color, max_len=108, line_h=12):
        words = text.split()
        lines = []
        cur = ""
        for w in words:
            test = cur + (" " if cur else "") + w
            if len(test) > max_len:
                lines.append(cur)
                cur = w
            else:
                cur = test
        if cur:
            lines.append(cur)

        y = start_point.y
        for l in lines:
            tw = fitz.TextWriter(page.rect)
            tw.append(fitz.Point(start_point.x, y), l, font=font, fontsize=size)
            tw.write_text(page, color=color)
            y += line_h
        return y

    # ==========================================
    # PAGE 1: Architecture, Innovation & Records
    # ==========================================
    p1 = doc.new_page(width=595.3, height=841.9)
    p1.draw_rect(p1.rect, color=c_bg_dark, fill=c_bg_dark)

    # 1. Header Banner
    h1_rect = fitz.Rect(25, 22, 570.3, 68)
    p1.draw_rect(h1_rect, color=c_border, fill=c_card_bg)
    draw_text(p1, fitz.Point(38, 41), "МЕЖДУНАРОДНАЯ ОЛИМПИАДА «OPEN DOORS»  •  РОССИЙСКИЙ УНИВЕРСИТЕТ ДРУЖБЫ НАРОДОВ (РУДН)", f_arial_bd, 9.2, c_gold)
    draw_text(p1, fitz.Point(38, 56), "ОТЧЁТ ОБ ИНЖЕНЕРНОМ И ПРОГРАММНОМ ПРОЕКТЕ (PORTFOLIO PROJECT REPORT — 2026)", f_arial, 8.2, c_gray)

    # 2. Title & Badge Box
    t_rect = fitz.Rect(25, 76, 570.3, 148)
    p1.draw_rect(t_rect, color=c_border, fill=c_card_bg)
    
    badge = fitz.Rect(38, 86, 235, 103)
    p1.draw_rect(badge, color=c_azure, fill=(0.10, 0.22, 0.36))
    draw_text(p1, fitz.Point(44, 98), "ВЕБ-ИНЖЕНЕРИЯ И АРХИТЕКТУРА СИСТЕМ", f_arial_bd, 7.8, c_azure)

    draw_text(p1, fitz.Point(38, 122), "Hussein Portfolio Platform", f_arial_bd, 17, c_white)
    draw_text(p1, fitz.Point(38, 138), "Высокопроизводительная трёхъязычная веб-система с поисковым ядром и автоматическим аудитом", f_arial, 9.0, c_gold)

    # 3. Metadata Panel
    m_rect = fitz.Rect(25, 156, 570.3, 218)
    p1.draw_rect(m_rect, color=c_border, fill=(0.055, 0.075, 0.12))
    
    draw_text(p1, fitz.Point(38, 173), "Разработчик и архитектор:", f_arial_bd, 8.5, c_gray)
    draw_text(p1, fitz.Point(185, 173), "Хуссейн Мохамед Эльбассиуни (Hussein ElBassiouni)", f_arial_bd, 8.5, c_white)

    draw_text(p1, fitz.Point(38, 188), "Открытый репозиторий GitHub:", f_arial_bd, 8.5, c_gray)
    draw_text(p1, fitz.Point(185, 188), "https://github.com/hus-bassi/hussein-portfolio (61+ коммитов)", f_arial, 8.5, c_azure)

    draw_text(p1, fitz.Point(38, 203), "Действующий сайт (Production):", f_arial_bd, 8.5, c_gray)
    draw_text(p1, fitz.Point(185, 203), "https://hus-bassi.vercel.app/?lang=ru (Production Vercel Platform)", f_arial, 8.5, c_green)

    # 4. Core Engineering Pillars
    y_p = 232
    draw_text(p1, fitz.Point(25, y_p), "КЛЮЧЕВЫЕ ИНЖЕНЕРНЫЕ ДОСТИЖЕНИЯ И АРХИТЕКТУРА СИСТЕМЫ:", f_arial_bd, 10, c_gold)

    pillars = [
        ("1. Трёхъязычный движок локализации (i18n Localization Engine)",
         "Полная поддержка Русского (LTR), Арабского (RTL) и Английского (LTR) языков без внешних библиотек. Динамическая смена направлений текста, типографики (Inter для русского/английского и IBM Plex Sans Arabic для арабского) и сохранение состояния через единый словарь STR."),

        ("2. Поисковая система в оперативной памяти (In-Memory Search Engine)",
         "Собственная индексация и поиск в реальном времени по 16+ академическим сертификатам, волонтёрским мероприятиям и спортивным турнирам. Моментальный многоязычный поиск и фильтрация по категориям без задержек сети."),

        ("3. Автоматизированный аудит качества (Automated Audit Suite — 13 тестов)",
         "Разработан комплексный инструментарий статического анализа (tools/check.js), проводящий 13 проверок: целостность CSS, аудит доступности и контрастности по стандарту WCAG 4.5:1, контроль анимаций и строгая верификация соответствия CV.md."),

        ("4. Кинематографический темный интерфейс (Cinematic Dark UI & Motion)",
         "Архитектура глубокого контраста с фирменным спектром (фиолетовый → золото → лазурный). Строгая лестница таймингов анимаций (от 150мс до 45с) с аппаратным ускорением GPU и безупречной поддержкой режима prefers-reduced-motion.")
    ]

    cur_y = y_p + 14
    for title, desc in pillars:
        box = fitz.Rect(25, cur_y, 570.3, cur_y + 48)
        p1.draw_rect(box, color=c_border, fill=c_card_bg)
        draw_text(p1, fitz.Point(36, cur_y + 14), title, f_arial_bd, 8.8, c_azure)
        draw_multiline(p1, fitz.Point(36, cur_y + 26), desc, f_calibri, 8.3, c_gray, max_len=112, line_h=11)
        cur_y += 54

    # 5. Screenshot Records Page
    draw_text(p1, fitz.Point(25, cur_y + 8), "ИНТЕРФЕЙС СИСТЕМЫ: АКАДЕМИЧЕСКИЕ ЗАПИСИ И СЕРТИФИКАТЫ НА РУССКОМ ЯЗЫКЕ", f_arial_bd, 9.2, c_gold)
    
    img_records = r"d:\hussein-portfolio\site_records_ru.png"
    if os.path.exists(img_records):
        img_rect1 = fitz.Rect(25, cur_y + 16, 570.3, 822)
        p1.insert_image(img_rect1, filename=img_records)

    # ==========================================
    # PAGE 2: GitHub Codebase, Stack & Timeline
    # ==========================================
    p2 = doc.new_page(width=595.3, height=841.9)
    p2.draw_rect(p2.rect, color=c_bg_dark, fill=c_bg_dark)

    # 1. Header Page 2
    h2_rect = fitz.Rect(25, 22, 570.3, 58)
    p2.draw_rect(h2_rect, color=c_border, fill=c_card_bg)
    draw_text(p2, fitz.Point(38, 39), "ПОДТВЕРЖДЕНИЕ ИСХОДНОГО КОДА, МЕТРИКИ GITHUB И АКАДЕМИЧЕСКИЙ РАЗДЕЛ", f_arial_bd, 9.2, c_gold)
    draw_text(p2, fitz.Point(38, 52), "Проект с открытым исходным кодом: структура модулей, версионирование и интеграция", f_arial, 8.2, c_gray)

    # 2. GitHub Section
    y_gh = 66
    draw_text(p2, fitz.Point(25, y_gh + 12), "ОТКРЫТЫЙ РЕПОЗИТОРИЙ GITHUB (GITHUB.COM/HUS-BASSI/HUSSEIN-PORTFOLIO)", f_arial_bd, 9.5, c_azure)
    
    img_gh = r"d:\hussein-portfolio\github_repo.png"
    if os.path.exists(img_gh):
        gh_rect = fitz.Rect(25, y_gh + 18, 570.3, y_gh + 265)
        p2.insert_image(gh_rect, filename=img_gh)

    # 3. Technical Specifications Box
    specs_y = y_gh + 273
    specs_rect = fitz.Rect(25, specs_y, 570.3, specs_y + 105)
    p2.draw_rect(specs_rect, color=c_border, fill=c_card_bg)

    draw_text(p2, fitz.Point(38, specs_y + 16), "ТЕХНИЧЕСКИЙ СТЕК И МЕТРИКИ ПРОИЗВОДИТЕЛЬНОСТИ ПЛАТФОРМЫ:", f_arial_bd, 9.0, c_gold)
    
    specs = [
        "• Архитектурная парадигма: Zero-Dependency Vanilla Web Stack (HTML5, Modern CSS Variables, Modular Vanilla JavaScript ES6+).",
        "• Метрики рендеринга: LCP (Largest Contentful Paint) < 0.8s, CLS = 0.000, 100% результат аудита доступности (WCAG 2.1 AA compliant).",
        "• Структура монорепозитория: /academic (базы данных на JS), /assets (CSS/JS модули), /tools (движок автотестов check.js).",
        "• Непрерывная интеграция и доставка (CI/CD): Автоматический деплой на Vercel и GitHub Pages при каждом пуше в ветку main.",
        "• Подтверждение авторства: 61 коммит, зарегистрированная история правок и архитектурных улучшений на GitHub."
    ]
    cur_sp_y = specs_y + 30
    for sp in specs:
        draw_text(p2, fitz.Point(38, cur_sp_y), sp, f_calibri, 8.2, c_white)
        cur_sp_y += 14

    # 4. Story & Russian Timeline Showcase
    y_story = specs_y + 115
    draw_text(p2, fitz.Point(25, y_story + 12), "РУССКОЯЗЫЧНЫЙ АКАДЕМИЧЕСКИЙ РАЗДЕЛ И ХРОНИКА РАЗВИТИЯ (STORY.HTML)", f_arial_bd, 9.5, c_azure)

    img_story = r"d:\hussein-portfolio\site_story_ru.png"
    if os.path.exists(img_story):
        story_rect = fitz.Rect(25, y_story + 18, 570.3, 765)
        p2.insert_image(story_rect, filename=img_story)

    # 5. Academic Conclusion
    footer_rect = fitz.Rect(25, 775, 570.3, 825)
    p2.draw_rect(footer_rect, color=c_border, fill=(0.055, 0.075, 0.12))
    draw_text(p2, fitz.Point(36, 791), "ЗАКЛЮЧЕНИЕ ДЛЯ ПРИЁМНОЙ КОМИССИИ РУДН И ОЛИМПИАДЫ «OPEN DOORS»:", f_arial_bd, 8.5, c_gold)
    draw_text(p2, fitz.Point(36, 805), "Платформа демонстрирует зрелые навыки кандидата в области проектирования веб-архитектуры, алгоритмов поиска, чистой верстки и", f_calibri, 8.0, c_gray)
    draw_text(p2, fitz.Point(36, 817), "глубокого уважения к русской культуре и языку, подтверждая готовность к успешному обучению на программах бакалавриата и магистратуры.", f_calibri, 8.0, c_gray)

    doc.save(pdf_path)
    doc.close()

if __name__ == "__main__":
    build_pdf()
