import os
import pymupdf

def build_merged_certificates_pdf(output_path):
    cert_list = [
        # Flagship & Core Specialization
        ("1. Introduction to Python (DataCamp)", "academic/assets/certificates/introduction-to-python.pdf"),
        ("2. Google Sheets Fundamentals Track - 15h (DataCamp)", "academic/assets/certificates/google-sheets-fundamentals.pdf"),
        ("3. Statistics Foundations 1: The Basics - NASBA CPE (LinkedIn)", "academic/assets/certificates/statistics-foundations-1-the-basics.pdf"),
        ("4. Elements of AI for Business (Univ. of Helsinki & MinnaLearn)", "academic/assets/certificates/elements-of-ai-for-business.jpg"),
        ("5. AI Career Readiness Training (ASEAN Foundation & LinkedIn)", "academic/assets/certificates/ai-career-readiness.png"),
        ("6. Non-Technical Skills of Effective Data Scientists - NASBA CPE (KNIME)", "academic/assets/certificates/non-technical-skills-effective-data-scientists.pdf"),
        ("7. Job Skills: Learning the Basics - PMI (LinkedIn)", "academic/assets/certificates/job-skills-learning-the-basics.pdf"),
        ("8. First Aid & Emergency Response (Edraak)", "academic/assets/certificates/first-aid-edraak-en.pdf"),
        
        # Individual DataCamp Course Certificates
        ("9. Introduction to Google Sheets (DataCamp)", "Introduction to Google Sheets.pdf"),
        ("10. Intermediate Google Sheets (DataCamp)", "Intermediate Google Sheets.pdf"),
        ("11. Data Analysis in Google Sheets (DataCamp)", "Data Analysis in Google Sheets_page-0001.jpg"),
        ("12. Data Visualization in Google Sheets (DataCamp)", "academic/assets/certificates/data-visualization-in-google-sheets.pdf"),

        # Professional Development & Career Strategy
        ("13. You Need a Career Development Plan (LinkedIn)", "academic/assets/certificates/you-need-a-career-development-plan.pdf"),
        ("14. Building Your Career (LinkedIn)", "academic/assets/certificates/building-your-career.pdf"),
        ("15. Making Your Next Career Move Your Best Move (LinkedIn)", "academic/assets/certificates/making-your-next-career-move-your-best-move.pdf"),
        ("16. Nano Tips for Closing the Soft Skills Gap with Gen Z (LinkedIn)", "academic/assets/certificates/nano-tips-closing-soft-skills-gap-gen-z.pdf"),
        ("17. Nano Tips for Building Soft Skills (LinkedIn)", "academic/assets/certificates/nano-tips-building-soft-skills-elayne-fluker.pdf"),
    ]

    merged_doc = pymupdf.open()
    toc = []
    current_page = 1

    for title, rel_path in cert_list:
        full_path = os.path.abspath(rel_path)
        if not os.path.exists(full_path):
            raise FileNotFoundError(f"Certificate file not found: {full_path}")

        ext = os.path.splitext(full_path)[1].lower()
        if ext == ".pdf":
            src_doc = pymupdf.open(full_path)
            num_pages = len(src_doc)
            toc.append([1, title, current_page])
            merged_doc.insert_pdf(src_doc)
            current_page += num_pages
        elif ext in [".jpg", ".jpeg", ".png"]:
            img_doc = pymupdf.open(full_path)
            pdf_bytes = img_doc.convert_to_pdf()
            src_doc = pymupdf.open("pdf", pdf_bytes)
            num_pages = len(src_doc)
            toc.append([1, title, current_page])
            merged_doc.insert_pdf(src_doc)
            current_page += num_pages

    merged_doc.set_toc(toc)
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    merged_doc.save(os.path.abspath(output_path), deflate=True)
    merged_doc.close()
    print(f"Merged {len(cert_list)} certificates successfully. Total pages: {current_page - 1}")

if __name__ == "__main__":
    out_file = os.path.join(r"d:\hussein-portfolio\مشروع", "Hussein_Mohamed_ElBassiouni_Certificates.pdf")
    build_merged_certificates_pdf(out_file)
