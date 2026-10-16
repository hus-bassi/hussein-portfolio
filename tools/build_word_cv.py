import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def create_element(name):
    return OxmlElement(name)

def set_cell_margins(cell, top=0, bottom=0, left=0, right=0):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_section_header(doc, title_text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(5)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.0
    
    # Border bottom in XML for clean ATS divider
    pPr = p._p.get_or_add_pPr()
    pBdr = parse_xml(r'<w:pBdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
                     r'<w:bottom w:val="single" w:sz="6" w:space="1" w:color="2563EB"/>'
                     r'</w:pBdr>')
    pPr.append(pBdr)
    
    run = p.add_run(title_text)
    run.font.name = 'Calibri'
    run.font.size = Pt(10.5)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B) # Slate dark navy

def add_entry_heading(doc, title_left, subtitle_left="", date_right=""):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.line_spacing = 1.05

    # Right align tab stop at 7.5 inches (printable width)
    pPr = p._p.get_or_add_pPr()
    tabs = parse_xml(r'<w:tabs xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
                    r'<w:tab w:val="right" w:pos="10800"/>'
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
    p.paragraph_format.space_after = Pt(1.5)
    p.paragraph_format.line_spacing = 1.05

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
    r_txt.font.size = Pt(9.0)
    r_txt.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

def build_cv(output_path):
    doc = docx.Document()

    # Set page size to A4 / Letter with compact 0.45 in margins for perfect 1-page fit
    for section in doc.sections:
        section.top_margin = Inches(0.42)
        section.bottom_margin = Inches(0.42)
        section.left_margin = Inches(0.50)
        section.right_margin = Inches(0.50)
        section.page_width = Inches(8.5)
        section.page_height = Inches(11.0)

    # ----------------------------------------------------
    # HEADER: Candidate Full Name & Professional Title
    # ----------------------------------------------------
    p_name = doc.add_paragraph()
    p_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_name.paragraph_format.space_before = Pt(0)
    p_name.paragraph_format.space_after = Pt(1)
    
    r_name = p_name.add_run("HUSSEIN MOHAMED MOSTAFA AHMED ELBASSIOUNI")
    r_name.font.name = 'Calibri'
    r_name.font.size = Pt(16.5)
    r_name.font.bold = True
    r_name.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A) # Deep navy/slate

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(2)
    
    r_sub = p_sub.add_run("Aspiring Business Informatics & Data Science Specialist | Full-Stack Systems Engineer")
    r_sub.font.name = 'Calibri'
    r_sub.font.size = Pt(9.5)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(0x25, 0x63, 0xEB) # Royal blue

    # Contact Info Bar
    p_contact = doc.add_paragraph()
    p_contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_contact.paragraph_format.space_before = Pt(0)
    p_contact.paragraph_format.space_after = Pt(4)
    
    contact_items = [
        "Cairo, Egypt",
        "hussein.b.data@gmail.com",
        "linkedin.com/in/hus-bassi",
        "github.com/hus-bassi",
        "hus-bassi.github.io/hussein-portfolio"
    ]
    r_contact = p_contact.add_run("  •  ".join(contact_items))
    r_contact.font.name = 'Calibri'
    r_contact.font.size = Pt(8.5)
    r_contact.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    # ----------------------------------------------------
    # SECTION 1: PROFESSIONAL SUMMARY
    # ----------------------------------------------------
    add_section_header(doc, "PROFESSIONAL SUMMARY")
    p_sum = doc.add_paragraph()
    p_sum.paragraph_format.space_before = Pt(2)
    p_sum.paragraph_format.space_after = Pt(3)
    p_sum.paragraph_format.line_spacing = 1.05
    r_sum = p_sum.add_run(
        "Driven Business Informatics and Data Science student practitioner with proven hands-on capability in full-stack web architectures, relational database engineering, and applied data analytics. System architect and developer of Souq Elmajde Medical, an active enterprise medical supplies platform and operations ERP in Egypt. Rigorous spreadsheet modeling foundation backed by DataCamp's 15-Hour Google Sheets Track and accredited analytics credentials (NASBA, PMI). Trilingual communicator fluent in Arabic, with professional working English and progressing Russian, preparing for Bachelor's studies in Business Informatics (Specialty 38.03.05) and long-term research in Data Science."
    )
    r_sum.font.name = 'Calibri'
    r_sum.font.size = Pt(8.8)
    r_sum.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    # ----------------------------------------------------
    # SECTION 2: TECHNICAL PROJECTS & PRODUCTION SYSTEMS
    # ----------------------------------------------------
    add_section_header(doc, "TECHNICAL PROJECTS & SYSTEMS ARCHITECTURE")
    add_entry_heading(doc, "Souq Elmajde Medical Platform (elmajde.com)", "Full-Stack Software Engineer & System Architect", "2025 – Present")
    add_bullet(doc, "Architected and engineered an end-to-end production medical e-commerce and ERP operations monorepo (Next.js 15, React 19 Server Components, TypeScript, PostgreSQL 16, Prisma ORM, Tailwind CSS, Android Native).", "Enterprise Architecture:")
    add_bullet(doc, "Designed a 25+ model relational database schema in 3NF with immutable order pricing snapshots, variant tracking, automated inventory alerts, and profit margin calculation state machines.", "Relational Database Design:")
    add_bullet(doc, "Engineered a custom logistics calculation engine covering all 27 Egyptian governorates with 3 distinct shipping tiers, Cash-on-Delivery (COD) reconciliation, and strict Egyptian mobile number validation.", "Logistics & Operations Engine:")
    add_bullet(doc, "Implemented server-side Meta Conversions API (CAPI) with order deduplication, dynamic CSP nonces, AES-256-GCM token encryption, and automated zero-downtime atomic release pipelines (deploy-atomic.sh).", "Security & DevOps Integration:")

    # ----------------------------------------------------
    # SECTION 3: PROFESSIONAL CERTIFICATIONS & CREDENTIALS
    # ----------------------------------------------------
    add_section_header(doc, "PROFESSIONAL CERTIFICATIONS & CREDENTIALS")
    
    add_entry_heading(doc, "Google Sheets Fundamentals (15-Hour Skill Track)", "DataCamp (Credential #967,410)", "Oct 2026")
    add_bullet(doc, "Comprehensive 15-hour curriculum unifying 5 accredited courses: Introduction to Google Sheets, Data Analysis, Intermediate Spreadsheets, Pivot Tables, and Data Visualization. Mastered complex VLOOKUPs, data cleaning, logical error handling, and interactive executive dashboard architecture.")

    add_entry_heading(doc, "Statistics Foundations 1: The Basics", "LinkedIn Learning & NASBA (1.80 CPE Credits, Registry #140940)", "Dec 2025")
    add_bullet(doc, "Completed accredited professional coursework covering descriptive statistics, data distributions, sample variance, standard deviation, and foundational probability models for data science.")

    add_entry_heading(doc, "Professional & AI Credentials", "ASEAN Foundation / MinnaLearn / KNIME / PMI", "2025 – 2026")
    add_bullet(doc, "AI Career Readiness Training (ASEAN Foundation & LinkedIn, Oct 2026) • Elements of AI for Business (MinnaLearn & Univ. of Helsinki, July 2026) • Non-Technical Skills of Effective Data Scientists (KNIME & NASBA 1.6 CPE, Dec 2025) • Job Skills: Learning the Basics (PMI Provider #4101, 0.25 PDUs, Dec 2025) • First Aid (Edraak, Sept 2026).")

    # ----------------------------------------------------
    # SECTION 4: VOLUNTEERING, LEADERSHIP & ATHLETICS
    # ----------------------------------------------------
    add_section_header(doc, "VOLUNTEERING, LEADERSHIP & ATHLETICS")
    
    add_entry_heading(doc, "Russian House in Cairo (Cultural Center & Youth Club)", "Event & Operations Coordinator", "June 2026")
    add_bullet(doc, "Coordinated stage preparation, audiovisual setup, and youth orientation for official cultural programs; managed hall logistics, tournament clocks, and arbiter coordination for competitive Chess Championships.")

    add_entry_heading(doc, "International Dictation 2026 & Competitive Athletics", "Russian House in Cairo / Youth Sports Centers", "2023 – 2026")
    add_bullet(doc, "Certified Participant in International Dictation 2026 (Arabic Language Nomination, Sept 2026) organized by the Russian House in Cairo and Moscow. Competitive Middle Blocker in youth volleyball; led frontline blocking defense to a 3–0 clean-sheet victory in Al-Safa Activation Tournament (2023) and 3rd Place in Ramadan Friendly Cup.")

    # ----------------------------------------------------
    # SECTION 5: EDUCATION & ACADEMIC DIRECTION
    # ----------------------------------------------------
    add_section_header(doc, "EDUCATION & ACADEMIC GOALS")
    add_entry_heading(doc, "General Secondary Education Certificate (Thanaweya Amma)", "Ministry of Education, Egypt", "Graduated 2022")
    add_bullet(doc, "Academic Score: 63%. Demonstrated sustained discipline, post-secondary self-study, and continuous upskilling across software engineering and data analytics.")
    add_bullet(doc, "Target Direction: Bachelor of Science in Business Informatics (Specialty 38.03.05) → Master's in Data Science → PhD in Data Science in Astronomy.", "Academic Plan:")

    # ----------------------------------------------------
    # SECTION 6: CORE SKILLS & TECHNICAL COMPETENCIES
    # ----------------------------------------------------
    add_section_header(doc, "CORE SKILLS & TECHNICAL COMPETENCIES")
    
    add_bullet(doc, "Next.js 15, React 19, TypeScript, JavaScript (ES6+), Node.js, Tailwind CSS, HTML5/CSS3, Python (Foundations).", "Programming & Frameworks:")
    add_bullet(doc, "PostgreSQL 16, Prisma ORM, Advanced Google Sheets & MS Excel (VLOOKUP, Pivot Tables, Statistical Functions, Dashboards).", "Databases & Data Analytics:")
    add_bullet(doc, "Monorepo Architecture (NPM Workspaces), REST APIs, Meta Conversions API (CAPI), Git/GitHub, Linux Cloud Hosting, AES-256-GCM.", "Systems & DevOps:")
    add_bullet(doc, "Arabic (Native), English (Professional Working), Russian (Academic Target / Elementary A2-B1 in progress).", "Languages & Communication:")

    doc.save(output_path)
    print("CV successfully saved to target docx path.")

if __name__ == '__main__':
    target = os.path.join(r"d:\hussein-portfolio\مشروع", "Hussein_Mohamed_ElBassiouni_CV.docx")
    build_cv(target)
