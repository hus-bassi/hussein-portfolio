/* Learning tools — only skills/tools actually being built.
   Add a new object here when a real tool becomes part of the learning path. */
const learningToolsData = [
  {
    id: 'python',
    name: 'Python',
    icon: 'Py',
    tone: 'gold',
    status: 'learning',
    description: {
      en: 'Learning — programming and data analysis',
      ar: 'قيد التعلم — البرمجة وتحليل البيانات',
      ru: 'Изучаю — программирование и анализ данных'
    }
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: '∑',
    tone: 'cyan',
    status: 'learning',
    description: {
      en: 'Learning — quantitative foundation for data',
      ar: 'قيد التعلم — الأساس الكمي لعلم البيانات',
      ru: 'Изучаю — количественная база для данных'
    }
  },
  {
    id: 'statistics',
    name: 'Statistics',
    icon: 'σ',
    tone: 'pink',
    status: 'learning',
    description: {
      en: 'Learning — probability and inference',
      ar: 'قيد التعلم — الاحتمال والاستدلال',
      ru: 'Изучаю — вероятность и выводы'
    }
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    icon: '⌁',
    tone: 'gold',
    status: 'learning',
    description: {
      en: 'Learning — cleaning data and reading patterns',
      ar: 'قيد التعلم — تنظيف البيانات وقراءة الأنماط',
      ru: 'Изучаю — очистка данных и закономерности'
    }
  },
  {
    id: 'english',
    name: 'English',
    icon: 'EN',
    tone: 'purple',
    status: 'building',
    description: {
      en: 'Building — academic language and communication',
      ar: 'قيد البناء — اللغة الأكاديمية والتواصل',
      ru: 'Строю — академический язык и общение'
    }
  },
  {
    id: 'russian',
    name: 'Russian',
    icon: 'RU',
    tone: 'purple',
    status: 'building',
    description: {
      en: 'Building — study language for the university path',
      ar: 'قيد البناء — لغة الدراسة للمسار الجامعي',
      ru: 'Строю — язык обучения для университетского пути'
    }
  },
  {
    id: 'research',
    name: 'Academic Research',
    icon: '?',
    tone: 'gold',
    status: 'learning',
    description: {
      en: 'Learning — framing questions and reading evidence',
      ar: 'قيد التعلم — صياغة الأسئلة وقراءة الأدلة',
      ru: 'Изучаю — постановка вопросов и доказательства'
    }
  }
];

if (typeof window !== 'undefined') window.learningToolsData = learningToolsData;
