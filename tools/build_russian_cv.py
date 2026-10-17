# -*- coding: utf-8 -*-
"""
Generate strictly 1-page, ATS-compliant Russian CV / Резюме for Hussein ElBassiouni,
incorporating all strategic structural guidelines:
1. Pure professional/academic Russian.
2. Structure: Summary -> Education -> Professional Certifications -> Projects -> Volunteering -> Core Skills.
3. No high school grade score (< 80%).
4. Academic goal (38.03.05 Business Informatics) strongly emphasized in Summary.
5. Strict 1-page layout verified via Word COM.
"""

import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement, parse_xml

sys.stdout.reconfigure(encoding="utf-8")

def add_section_header(doc, title_text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(3.5)
    p.paragraph_format.space_after = Pt(1.5)
    p.paragraph_format.line_spacing = 1.0
    
    # Border bottom in XML for clean ATS divider
    pPr = p._p.get_or_add_pPr()
    pBdr = parse_xml(r'<w:pBdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
                     r'<w:bottom w:val="single" w:sz="6" w:space="1" w:color="2563EB"/>'
                     r'</w:pBdr>')
    pPr.append(pBdr)
    
    run = p.add_run(title_text)
    run.font.name = 'Calibri'
    run.font.size = Pt(10.0)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B) # Slate dark navy

def add_entry_heading(doc, title_left, subtitle_left="", date_right=""):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2.0)
    p.paragraph_format.space_after = Pt(0.5)
    p.paragraph_format.line_spacing = 1.02

    # Right align tab stop at printable margin
    pPr = p._p.get_or_add_pPr()
    tabs = parse_xml(r'<w:tabs xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
                    r'<w:tab w:val="right" w:pos="10900"/>'
                    r'</w:tabs>')
    pPr.append(tabs)

    r_title = p.add_run(title_left)
    r_title.font.name = 'Calibri'
    r_title.font.size = Pt(9.5)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    if subtitle_left:
        r_sub = p.add_run(f" | {subtitle_left}")
        r_sub.font.name = 'Calibri'
        r_sub.font.size = Pt(9.0)
        r_sub.font.italic = True
        r_sub.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    if date_right:
        p.add_run("\t")
        r_date = p.add_run(date_right)
        r_date.font.name = 'Calibri'
        r_date.font.size = Pt(9.0)
        r_date.font.bold = True
        r_date.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

def add_bullet(doc, text, bold_prefix=""):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.18)
    p.paragraph_format.first_line_indent = Inches(-0.14)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(1.0)
    p.paragraph_format.line_spacing = 1.02

    # Bullet symbol
    r_b = p.add_run("•  ")
    r_b.font.name = 'Calibri'
    r_b.font.size = Pt(9.0)
    r_b.font.color.rgb = RGBColor(0x25, 0x63, 0xEB) # Accent blue

    if bold_prefix:
        r_pre = p.add_run(bold_prefix + " ")
        r_pre.font.name = 'Calibri'
        r_pre.font.size = Pt(9.0)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)

    r_txt = p.add_run(text)
    r_txt.font.name = 'Calibri'
    r_txt.font.size = Pt(8.8)
    r_txt.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

def build_russian_cv(output_path):
    doc = docx.Document()

    # Set page size to Letter / A4 with compact 0.36 in margins for perfect 1-page fit
    for section in doc.sections:
        section.top_margin = Inches(0.36)
        section.bottom_margin = Inches(0.36)
        section.left_margin = Inches(0.44)
        section.right_margin = Inches(0.44)
        section.page_width = Inches(8.5)
        section.page_height = Inches(11.0)

    # ----------------------------------------------------
    # HEADER: Candidate Full Name & Professional Title
    # ----------------------------------------------------
    p_name = doc.add_paragraph()
    p_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_name.paragraph_format.space_before = Pt(0)
    p_name.paragraph_format.space_after = Pt(1)
    
    r_name = p_name.add_run("ХУССЕЙН МОХАМЕД МОСТАФА АХМЕД ЭЛЬБАССИУНИ")
    r_name.font.name = 'Calibri'
    r_name.font.size = Pt(15.5)
    r_name.font.bold = True
    r_name.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(1.5)
    
    r_sub = p_sub.add_run("Специалист по бизнес-информатике и науке о данных | Full-Stack разработчик")
    r_sub.font.name = 'Calibri'
    r_sub.font.size = Pt(9.5)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(0x25, 0x63, 0xEB)

    # Contact Info Bar
    p_contact = doc.add_paragraph()
    p_contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_contact.paragraph_format.space_before = Pt(0)
    p_contact.paragraph_format.space_after = Pt(2.5)
    
    contact_items = [
        "Каир, Египет",
        "hussein.b.data@gmail.com",
        "+201022977790",
        "linkedin.com/in/hus-bassi",
        "github.com/hus-bassi",
        "hus-bassi.vercel.app"
    ]
    r_contact = p_contact.add_run("  •  ".join(contact_items))
    r_contact.font.name = 'Calibri'
    r_contact.font.size = Pt(8.5)
    r_contact.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    # ----------------------------------------------------
    # SECTION 1: ПРОФЕССИОНАЛЬНЫЙ ПРОФИЛЬ (SUMMARY)
    # ----------------------------------------------------
    add_section_header(doc, "ПРОФЕССИОНАЛЬНЫЙ ПРОФИЛЬ")
    p_sum = doc.add_paragraph()
    p_sum.paragraph_format.space_before = Pt(1.5)
    p_sum.paragraph_format.space_after = Pt(2.0)
    p_sum.paragraph_format.line_spacing = 1.02
    r_sum = p_sum.add_run(
        "Целеустремленный практик в области бизнес-информатики и анализа данных с подтвержденным практическим опытом веб-архитектуры, проектирования реляционных баз данных и прикладной аналитики. Создатель и ведущий разработчик Souq Elmajde Medical — действующей enterprise-платформы медицинского снабжения и ERP-системы в Египте. Обладает фундаментальной подготовкой по аналитике данных на базе 15-часового трека DataCamp и аккредитованными квалификациями (NASBA, PMI). Академическая цель: получение высшего образования по программе бакалавриата 38.03.05 «Бизнес-информатика» в ведущих университетах РФ с дальнейшим продолжением научно-исследовательской деятельности в магистратуре по Data Science. Владеет арабским (родной), английским (профессиональный рабочий) и русским языками."
    )
    r_sum.font.name = 'Calibri'
    r_sum.font.size = Pt(8.6)
    r_sum.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    # ----------------------------------------------------
    # SECTION 2: ОБРАЗОВАНИЕ (EDUCATION) — Right after Summary
    # ----------------------------------------------------
    add_section_header(doc, "ОБРАЗОВАНИЕ")
    add_entry_heading(doc, "Аттестат о среднем общем образовании (Танавия Амма)", "Министерство образования Египта", "2022")
    add_bullet(doc, "Успешно освоил полный курс общего среднего образования. Продемонстрировал высокую учебную дисциплину, систематическое непрерывное самообразование и углубленное практическое освоение программной инженерии и методов анализа данных.")

    # ----------------------------------------------------
    # SECTION 3: ПРОФЕССИОНАЛЬНАЯ СЕРТИФИКАЦИЯ И КУРСЫ
    # ----------------------------------------------------
    add_section_header(doc, "ПРОФЕССИОНАЛЬНАЯ СЕРТИФИКАЦИЯ И КУРСЫ")
    
    add_entry_heading(doc, "Квалификационные треки DataCamp (Python и анализ данных)", "DataCamp (№967,410 & №47,542,030)", "Октябрь 2026")
    add_bullet(doc, "Google Sheets Fundamentals (15-часовой спецтрек): комплекс из 5 курсов (анализ, сложное моделирование VLOOKUP, сводные таблицы, дашборды).")
    add_bullet(doc, "Introduction to Python (4-часовой курс): синтаксис, срезы списков, функции, пакеты и численный анализ 2D-матриц в NumPy.")

    add_entry_heading(doc, "Statistics Foundations 1: The Basics", "LinkedIn Learning & NASBA (1.80 CPE Credits, №140940)", "Декабрь 2025")
    add_bullet(doc, "Аккредитованная программа по описательной статистике, законам распределения, дисперсии и вероятностным моделям для Data Science.")

    add_entry_heading(doc, "Международные сертификации по ИИ и карьерным компетенциям", "Университет Хельсинки / ASEAN / KNIME / PMI", "2025 – 2026")
    add_bullet(doc, "Elements of AI for Business (Унив. Хельсинки & MinnaLearn) • AI Career Readiness (Фонд АСЕАН & LinkedIn) • Data Science Non-Technical Skills (KNIME & NASBA 1.6 CPE) • Job Skills (PMI) • First Aid (Edraak).")

    # ----------------------------------------------------
    # SECTION 4: ТЕХНИЧЕСКИЕ ПРОЕКТЫ И РАЗРАБОТКА
    # ----------------------------------------------------
    add_section_header(doc, "ТЕХНИЧЕСКИЕ ПРОЕКТЫ И СИСТЕМНАЯ АРХИТЕКТУРА")
    add_entry_heading(doc, "Медицинская платформа Souq Elmajde (elmajde.com)", "Full-Stack инженер и системный архитектор", "2025 – наст. вр.")
    add_bullet(doc, "Архитектура: спроектировал и развернул промышленный e-commerce монорепозиторий и ERP-систему (Next.js 15, React 19, TypeScript, PostgreSQL 16, Prisma ORM, Tailwind CSS, Android Native).", "Enterprise-архитектура:")
    add_bullet(doc, "Реляционные БД: спроектировал схему из 25+ моделей в 3NF с неизменяемыми снимками цен заказов, учетом вариаций, авто-оповещениями склада и автоматом расчета маржинальности.", "Проектирование БД:")
    add_bullet(doc, "Логистический движок: разработал серверный алгоритм расчета доставки по 27 провинциям Египта с 3 тарифными зонами, сверкой наложенного платежа (COD) и валидацией телефонов.", "Логистический движок:")
    add_bullet(doc, "Безопасность и DevOps: интегрировал Meta Conversions API (CAPI) с дедупликацией, динамические CSP-нонсы, шифрование AES-256-GCM и пайплайн атомарного деплоя (deploy-atomic.sh).", "Безопасность и DevOps:")

    # ----------------------------------------------------
    # SECTION 5: ВОЛОНТЕРСТВО И ОБЩЕСТВЕННАЯ ДЕЯТЕЛЬНОСТЬ
    # ----------------------------------------------------
    add_section_header(doc, "ВОЛОНТЕРСТВО, ЛИДЕРСТВО И СПОРТ")
    
    add_entry_heading(doc, "Русский дом в Каире (Представительство Россотрудничества)", "Координатор мероприятий и логистики", "Июнь 2026")
    add_bullet(doc, "Официальная благодарность за координацию сценического и медиа-оборудования культурных программ; подготовка турнирных часов, регламента и судейства открытых шахматных чемпионатов.")

    add_entry_heading(doc, "Тотальный диктант 2026 и спортивные достижения", "Русский дом в Каире / Спортивные клубы", "2023 – 2026")
    add_bullet(doc, "Сертифицированный участник Международного диктанта 2026 (Москва / Каир). Центральный блокирующий в молодежном волейболе; победа 3:0 в активизационном турнире Аль-Сафа (2023).")

    # ----------------------------------------------------
    # SECTION 6: КЛЮЧЕВЫЕ НАВЫКИ И КОМПЕТЕНЦИИ
    # ----------------------------------------------------
    add_section_header(doc, "КЛЮЧЕВЫЕ НАВЫКИ И КОМПЕТЕНЦИИ")
    
    add_bullet(doc, "Next.js 15, React 19, TypeScript, JavaScript (ES6+), Node.js, Tailwind CSS, HTML5/CSS3, Python (NumPy, DataCamp Certified).", "Языки и фреймворки:")
    add_bullet(doc, "PostgreSQL 16, Prisma ORM, профессиональный Google Sheets и Excel (VLOOKUP, Pivot Tables, мат. модели, дашборды).", "Базы данных и аналитика:")
    add_bullet(doc, "Монорепозитории (NPM Workspaces), REST API, Meta Conversions API (CAPI), Git/GitHub, Linux Cloud Hosting, шифрование AES-256-GCM.", "Системная инженерия:")
    add_bullet(doc, "Арабский (родной), Английский (профессиональный рабочий), Русский (изучение, A2-B1, целевой академический приоритет).", "Языки:")

    doc.save(output_path)
    print("Russian CV successfully saved to docx.")

    # Auto-export to PDF via Word COM and verify 1-page constraint
    try:
        import win32com.client
        pdf_path = os.path.splitext(output_path)[0] + ".pdf"
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        doc_com = word.Documents.Open(os.path.abspath(output_path))
        pages = doc_com.ComputeStatistics(2)
        print(f"WORD RENDERED RUSSIAN CV PAGES: {pages}")
        doc_com.SaveAs(os.path.abspath(pdf_path), FileFormat=17)
        doc_com.Close(False)
        word.Quit()
        print("Russian CV PDF successfully exported.")
        if pages != 1:
            raise RuntimeError(f"Strict 1-page ATS violation! Word rendered {pages} pages.")
    except Exception as e:
        print(f"PDF Export / Validation Status: {type(e).__name__}: {e}")
        raise e

if __name__ == '__main__':
    target = os.path.join(r"d:\hussein-portfolio\مشروع", "CV_Hussein_ElBassiouni_Russian.docx")
    build_russian_cv(target)
