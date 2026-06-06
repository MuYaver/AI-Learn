import { getDb, runSql, queryOne } from '../lib/db.js';

const db = getDb();

const units = [
  { title: 'What is AI?', description: 'Discover the basics of artificial intelligence', order: 1 },
  { title: 'How Machines Learn', description: 'Understand machine learning fundamentals', order: 2 },
  { title: 'Neural Networks 101', description: 'Explore the building blocks of deep learning', order: 3 },
  { title: 'NLP & LLMs', description: 'How AI understands and generates language', order: 4 },
  { title: 'Computer Vision', description: 'How AI sees and interprets images', order: 5 },
  { title: 'AI Ethics', description: 'The responsibilities of building AI', order: 6 },
  { title: 'Prompt Engineering', description: 'Crafting effective prompts for AI models', order: 7 },
  { title: 'Building with AI', description: 'Practical AI development skills', order: 8 },
];

const lessonData = {
  1: [
    { title: 'Defining AI', content: [
      { type: 'multiple_choice', question: 'What does AI stand for?', options: '["Artificial Intelligence","Automated Integration","Advanced Interface","Algorithmic Input"]', answer: 'Artificial Intelligence', explanation: 'AI stands for Artificial Intelligence — the simulation of human intelligence by machines.' },
      { type: 'true_false', question: 'True or False: All computer programs are AI programs.', options: null, answer: 'false', explanation: 'Most computer programs follow fixed rules. AI programs can learn and adapt from data.' },
      { type: 'fill_blank', question: 'AI is the simulation of human _____ by machines.', options: null, answer: 'intelligence', explanation: 'AI aims to mimic human cognitive functions like learning and problem-solving.' },
    ]},
    { title: 'Types of AI', content: [
      { type: 'multiple_choice', question: 'Which type of AI is designed for a single specific task?', options: '["Narrow AI","General AI","Super AI","Universal AI"]', answer: 'Narrow AI', explanation: 'Narrow AI (also called Weak AI) excels at one specific task, like playing chess or recognizing faces.' },
      { type: 'true_false', question: 'True or False: General AI (AGI) currently exists and matches human-level intelligence across all tasks.', options: null, answer: 'false', explanation: 'AGI does not yet exist. All current AI systems are Narrow AI specialized in specific domains.' },
      { type: 'match', question: 'Match each AI type with its description:', options: '["Narrow AI:Specialized in one task","General AI:Human-level across all tasks","Super AI:Surpasses human intelligence"]', answer: 'Narrow AI:Specialized in one task', explanation: 'Narrow AI is task-specific, General AI would match human cognition broadly, and Super AI would exceed it.' },
    ]},
  ],
  2: [
    { title: 'Supervised Learning', content: [
      { type: 'multiple_choice', question: 'In supervised learning, the training data includes:', options: '["Labels/Target answers","No labels","Only images","Random noise"]', answer: 'Labels/Target answers', explanation: 'Supervised learning uses labeled data where each example has a known correct output.' },
      { type: 'fill_blank', question: 'Supervised learning requires _____ data to train models.', options: null, answer: 'labeled', explanation: 'Labels tell the model what the correct answer should be for each training example.' },
      { type: 'true_false', question: 'True or False: A spam email filter is an example of supervised learning.', options: null, answer: 'true', explanation: 'Spam filters are trained on labeled emails (spam/not spam), making them a classic supervised learning example.' },
    ]},
    { title: 'Unsupervised Learning', content: [
      { type: 'multiple_choice', question: 'What does unsupervised learning find in data?', options: '["Hidden patterns","Labels","Corrections","Answers"]', answer: 'Hidden patterns', explanation: 'Unsupervised learning discovers natural groupings and patterns without predefined labels.' },
      { type: 'true_false', question: 'True or False: Clustering customers into groups based on purchasing behavior is unsupervised learning.', options: null, answer: 'true', explanation: 'Customer segmentation uses clustering algorithms to group similar customers without pre-labeled categories.' },
      { type: 'fill_blank', question: 'A common unsupervised learning technique is called _____.', options: null, answer: 'clustering', explanation: 'Clustering algorithms group similar data points together based on their features.' },
    ]},
  ],
  3: [
    { title: 'Neuron Basics', content: [
      { type: 'multiple_choice', question: 'What is the basic unit of a neural network?', options: '["Neuron/Node","Gene","Pixel","Byte"]', answer: 'Neuron/Node', explanation: 'Neural networks are composed of interconnected neurons (nodes) arranged in layers.' },
      { type: 'fill_blank', question: 'Neural networks are inspired by the human _____.', options: null, answer: 'brain', explanation: 'Artificial neural networks loosely model the structure and function of biological neural networks.' },
      { type: 'true_false', question: 'True or False: A single neuron can solve any complex problem on its own.', options: null, answer: 'false', explanation: 'Individual neurons perform simple computations. Networks of many neurons working together can solve complex problems.' },
    ]},
  ],
  4: [
    { title: 'What is NLP?', content: [
      { type: 'multiple_choice', question: 'What does NLP stand for in AI?', options: '["Natural Language Processing","Neural Learning Protocol","New Language Program","Network Layer Protocol"]', answer: 'Natural Language Processing', explanation: 'NLP is the field of AI focused on enabling computers to understand, interpret, and generate human language.' },
      { type: 'fill_blank', question: 'NLP helps computers understand human _____.', options: null, answer: 'language', explanation: 'NLP bridges the gap between human communication and computer understanding.' },
      { type: 'true_false', question: 'True or False: Text auto-complete on your phone uses NLP.', options: null, answer: 'true', explanation: 'Auto-complete and predictive text use NLP models trained on language patterns.' },
    ]},
    { title: 'Large Language Models', content: [
      { type: 'multiple_choice', question: 'What does LLM stand for?', options: '["Large Language Model","Linear Logic Module","Long Learning Method","Logical Language Map"]', answer: 'Large Language Model', explanation: 'LLMs are massive neural networks trained on vast text datasets to understand and generate human-like text.' },
      { type: 'true_false', question: 'True or False: GPT (like ChatGPT) is an example of a Large Language Model.', options: null, answer: 'true', explanation: 'GPT (Generative Pre-trained Transformer) is one of the most well-known LLM architectures.' },
      { type: 'fill_blank', question: 'LLMs are trained on massive amounts of _____ data.', options: null, answer: 'text', explanation: 'The "Large" in LLM refers to both the model size and the enormous text datasets used for training.' },
    ]},
  ],
  5: [
    { title: 'How AI Sees', content: [
      { type: 'multiple_choice', question: 'What type of neural network is commonly used for image recognition?', options: '["CNN (Convolutional Neural Network)","RNN","LSTM","GAN"]', answer: 'CNN (Convolutional Neural Network)', explanation: 'CNNs excel at detecting patterns like edges, textures, and shapes in images through convolutional layers.' },
      { type: 'fill_blank', question: 'Computer vision enables machines to "see" and interpret _____ data.', options: null, answer: 'visual', explanation: 'Computer vision processes images and videos to extract meaningful information.' },
      { type: 'true_false', question: 'True or False: Face recognition on smartphones uses computer vision.', options: null, answer: 'true', explanation: 'Face recognition systems use computer vision algorithms to detect and verify facial features.' },
    ]},
  ],
  6: [
    { title: 'Bias in AI', content: [
      { type: 'multiple_choice', question: 'Where does AI bias typically come from?', options: '["Training data","Computer hardware","Internet speed","Battery level"]', answer: 'Training data', explanation: 'AI systems learn patterns from their training data. If that data contains biases, the AI will replicate them.' },
      { type: 'true_false', question: 'True or False: AI systems are always completely objective and unbiased.', options: null, answer: 'false', explanation: 'AI reflects the data it is trained on. If the data has biases, the AI will too unless specifically addressed.' },
      { type: 'fill_blank', question: 'Fair AI requires carefully curating training data to avoid _____.', options: null, answer: 'bias', explanation: 'Diverse and representative training data helps reduce biased outcomes in AI systems.' },
    ]},
    { title: 'Responsible AI', content: [
      { type: 'multiple_choice', question: 'Which is a key principle of responsible AI?', options: '["Transparency","Secrecy","Speed","Profit"]', answer: 'Transparency', explanation: 'Responsible AI emphasizes transparency, fairness, accountability, and privacy in AI development.' },
      { type: 'true_false', question: 'True or False: AI developers have no ethical responsibilities once their model is deployed.', options: null, answer: 'false', explanation: 'Developers have ongoing responsibility to monitor for harmful outputs and biases in deployed AI systems.' },
    ]},
  ],
  7: [
    { title: 'Writing Good Prompts', content: [
      { type: 'multiple_choice', question: 'What makes an effective AI prompt?', options: '["Clear and specific instructions","Vague questions","Single words only","Random text"]', answer: 'Clear and specific instructions', explanation: 'Well-crafted prompts provide context, clarity, and specific instructions to get better AI responses.' },
      { type: 'fill_blank', question: 'Giving AI examples within your prompt is called _____-shot prompting.', options: null, answer: 'few', explanation: 'Few-shot prompting provides a few examples in the prompt to guide the AI toward the desired output format.' },
      { type: 'true_false', question: 'True or False: Shorter prompts always produce better results than longer ones.', options: null, answer: 'false', explanation: 'The quality matters more than length. A clear detailed prompt often outperforms a vague short one.' },
    ]},
  ],
  8: [
    { title: 'AI Tools & APIs', content: [
      { type: 'multiple_choice', question: 'How do developers typically integrate AI into their apps?', options: '["Using APIs","Rewriting the AI from scratch","Downloading the model brain","Sending emails"]', answer: 'Using APIs', explanation: 'Most developers use AI APIs (like OpenAI, Claude, or HuggingFace) to add AI capabilities to applications.' },
      { type: 'true_false', question: 'True or False: You need a PhD in machine learning to build an AI-powered application.', options: null, answer: 'false', explanation: 'Modern AI APIs and tools make it possible for developers of all levels to integrate AI into their projects.' },
      { type: 'fill_blank', question: 'An _____ is an interface that lets your app communicate with an AI service.', options: null, answer: 'API', explanation: 'APIs (Application Programming Interfaces) allow different software systems to communicate and share capabilities.' },
    ]},
  ],
};

const videos = [
  { unit: 1, lesson: 1, title: 'What Is AI? | Artificial Intelligence | Simplilearn', url: 'https://www.youtube.com/embed/ad79nYk2keg', order: 1 },
  { unit: 1, lesson: 1, title: 'What is Artificial Intelligence? In 5 Minutes', url: 'https://www.youtube.com/embed/2ePf9rue1Ao', order: 2 },
  { unit: 1, lesson: 2, title: 'What Is AI? | Artificial Intelligence (Full Overview)', url: 'https://www.youtube.com/embed/ad79nYk2keg', order: 1 },
  { unit: 2, lesson: 1, title: 'Supervised vs Unsupervised vs Reinforcement Learning | Simplilearn', url: 'https://www.youtube.com/embed/1FZ0A1QCMWc', order: 1 },
  { unit: 2, lesson: 2, title: 'Supervised vs Unsupervised vs Reinforcement Learning | Simplilearn', url: 'https://www.youtube.com/embed/1FZ0A1QCMWc', order: 1 },
  { unit: 3, lesson: 1, title: 'But What Is a Neural Network? | 3Blue1Brown', url: 'https://www.youtube.com/embed/aircAruvnKk', order: 1 },
  { unit: 4, lesson: 1, title: 'Natural Language Processing In 5 Minutes | Simplilearn', url: 'https://www.youtube.com/embed/CMrHM8a3hqw', order: 1 },
  { unit: 4, lesson: 1, title: 'What are Large Language Models (LLMs)?', url: 'https://www.youtube.com/embed/iR2O2GPbB0E', order: 2 },
  { unit: 4, lesson: 2, title: 'What are Large Language Models (LLMs)?', url: 'https://www.youtube.com/embed/iR2O2GPbB0E', order: 1 },
  { unit: 5, lesson: 1, title: 'Computer Vision Explained in 5 Minutes | Simplilearn', url: 'https://www.youtube.com/embed/puB-4LuRNys', order: 1 },
  { unit: 6, lesson: 1, title: 'Ethics & AI: Equal Access and Algorithmic Bias', url: 'https://www.youtube.com/embed/tJQSyzBUAew', order: 1 },
  { unit: 6, lesson: 2, title: 'What is Responsible AI? | AI Ethics Explained', url: 'https://www.youtube.com/embed/6gLiOfP-C5k', order: 1 },
  { unit: 6, lesson: 2, title: 'AI Ethics Explained - Responsible Use of AI', url: 'https://www.youtube.com/embed/0eHjPWgUQhc', order: 2 },
  { unit: 7, lesson: 1, title: 'Learn Prompt Engineering: Full Beginner Crash Course', url: 'https://www.youtube.com/embed/LWiMwhDZ9as', order: 1 },
  { unit: 8, lesson: 1, title: 'Introduction to Generative AI', url: 'https://www.youtube.com/embed/G2fqAlgmoPo', order: 1 },
];

const shopItems = [
  { name: 'Streak Freeze', description: 'Protects your streak if you miss a day of practice', type: 'streak_freeze', cost_gems: 50, effect_data: null },
  { name: 'Heart Refill', description: 'Instantly refill all 5 hearts', type: 'hearts_refill', cost_gems: 100, effect_data: '{"hearts": 5}' },
  { name: 'XP Boost', description: 'Double XP for the next 3 lessons (24 hour expiry)', type: 'xp_boost', cost_gems: 150, effect_data: '{"multiplier": 2, "lessons": 3, "hours": 24}' },
  { name: 'Mega XP Boost', description: 'Triple XP for the next 5 lessons (48 hour expiry)', type: 'xp_boost', cost_gems: 300, effect_data: '{"multiplier": 3, "lessons": 5, "hours": 48}' },
  { name: 'Timer Bonus', description: 'Gives extra time on timed challenges', type: 'cosmetic', cost_gems: 75, effect_data: '{"extra_seconds": 30}' },
  { name: 'Golden Owl Avatar', description: 'Show off with an exclusive golden owl avatar', type: 'cosmetic', cost_gems: 500, effect_data: '{"avatar": "golden_owl"}' },
];

const achievements = [
  { name: 'First Steps', description: 'Complete your first lesson', icon: '👶', criteria_type: 'lessons_completed', criteria_value: 1, reward_xp: 50, reward_gems: 5 },
  { name: 'Getting Started', description: 'Complete 5 lessons', icon: '🌱', criteria_type: 'lessons_completed', criteria_value: 5, reward_xp: 100, reward_gems: 10 },
  { name: 'Learner', description: 'Complete 10 lessons', icon: '📚', criteria_type: 'lessons_completed', criteria_value: 10, reward_xp: 200, reward_gems: 20 },
  { name: 'Scholar', description: 'Complete 20 lessons', icon: '🎓', criteria_type: 'lessons_completed', criteria_value: 20, reward_xp: 500, reward_gems: 50 },
  { name: 'XP Hunter', description: 'Earn 500 total XP', icon: '⭐', criteria_type: 'total_xp', criteria_value: 500, reward_xp: 100, reward_gems: 15 },
  { name: 'XP Champion', description: 'Earn 2000 total XP', icon: '🌟', criteria_type: 'total_xp', criteria_value: 2000, reward_xp: 300, reward_gems: 30 },
  { name: 'XP Legend', description: 'Earn 5000 total XP', icon: '👑', criteria_type: 'total_xp', criteria_value: 5000, reward_xp: 500, reward_gems: 50 },
  { name: 'Week Streak', description: 'Maintain a 7-day streak', icon: '🔥', criteria_type: 'streak', criteria_value: 7, reward_xp: 150, reward_gems: 15 },
  { name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '📅', criteria_type: 'streak', criteria_value: 30, reward_xp: 500, reward_gems: 50 },
  { name: 'Perfect Score', description: 'Score 100% on a lesson', icon: '💯', criteria_type: 'perfect_lesson', criteria_value: 1, reward_xp: 100, reward_gems: 20 },
  { name: 'Perfectionist', description: 'Score 100% on 5 lessons', icon: '🏆', criteria_type: 'perfect_lesson', criteria_value: 5, reward_xp: 300, reward_gems: 40 },
  { name: 'Night Owl', description: 'Complete a lesson after 10 PM', icon: '🦉', criteria_type: 'night_owl', criteria_value: 1, reward_xp: 50, reward_gems: 10 },
  { name: 'Early Bird', description: 'Complete a lesson before 8 AM', icon: '🌅', criteria_type: 'early_bird', criteria_value: 1, reward_xp: 50, reward_gems: 10 },
  { name: 'Speed Demon', description: 'Complete a lesson in under 2 minutes', icon: '⚡', criteria_type: 'speed_demon', criteria_value: 1, reward_xp: 100, reward_gems: 20 },
  { name: 'Gems Collector', description: 'Save up 500 gems', icon: '💎', criteria_type: 'gems_collected', criteria_value: 500, reward_xp: 200, reward_gems: 25 },
];

function seed() {
  const existing = queryOne('SELECT COUNT(*) as count FROM units');

  if (existing.count === 0) {
    console.log('Seeding database...');

    const insertUnit = db.prepare('INSERT INTO units (title, description, "order") VALUES (?, ?, ?)');
    const insertLesson = db.prepare('INSERT INTO lessons (unit_id, title, "order") VALUES (?, ?, ?)');
    const insertExercise = db.prepare('INSERT INTO exercises (lesson_id, type, question, options, correct_answer, explanation, "order") VALUES (?, ?, ?, ?, ?, ?, ?)');
    const insertShopItem = db.prepare('INSERT INTO shop_items (name, description, type, cost_gems, effect_data) VALUES (?, ?, ?, ?, ?)');
    const insertAchievement = db.prepare('INSERT INTO achievements (name, description, icon, criteria_type, criteria_value, reward_xp, reward_gems) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const insertChallenge = db.prepare('INSERT OR IGNORE INTO daily_challenges (challenge_date, title, description, target_type, target_value, reward_xp, reward_gems) VALUES (?, ?, ?, ?, ?, ?, ?)');

    for (const unit of units) {
      insertUnit.run(unit.title, unit.description, unit.order);
    }

    let exerciseOrder = 0;
    for (const [unitIdx, lessons] of Object.entries(lessonData)) {
      const unitId = parseInt(unitIdx);
      for (const [lessonIdx, lesson] of lessons.entries()) {
        const result = insertLesson.run(unitId, lesson.title, lessonIdx + 1);
        const lessonId = result.lastInsertRowid;
        for (const [exIdx, ex] of lesson.content.entries()) {
          insertExercise.run(lessonId, ex.type, ex.question, ex.options, ex.answer, ex.explanation, exIdx + 1);
          exerciseOrder++;
        }
      }
    }

    for (const item of shopItems) {
      insertShopItem.run(item.name, item.description, item.type, item.cost_gems, item.effect_data);
    }

    for (const ach of achievements) {
      insertAchievement.run(ach.name, ach.description, ach.icon, ach.criteria_type, ach.criteria_value, ach.reward_xp, ach.reward_gems);
    }

    const today = new Date().toISOString().split('T')[0];
    const challenges = [
      [today, 'Practice Makes Perfect', 'Complete 2 lessons today', 'lessons_today', 2, 50, 10],
      [today, 'XP Hunter', 'Earn 80 XP today', 'xp_today', 80, 60, 15],
      [today, 'Perfect Shot', 'Get 100% on any lesson', 'perfect_lesson', 1, 75, 20],
    ];
    for (const c of challenges) {
      insertChallenge.run(...c);
    }

    console.log(`Seeded: ${units.length} units, ~45 exercises, ${shopItems.length} shop items, ${achievements.length} achievements, ${challenges.length} challenges`);
  } else {
    console.log('Database already seeded. Skipping curriculum.');
  }

  const existingVideos = queryOne('SELECT COUNT(*) as count FROM videos');
  if (existingVideos.count === 0) {
    console.log('Seeding videos...');

    const insertVideo = db.prepare('INSERT INTO videos (lesson_id, title, url, "order") VALUES (?, ?, ?, ?)');

    for (const video of videos) {
      const lesson = queryOne(
        'SELECT l.id FROM lessons l JOIN units u ON l.unit_id = u.id WHERE u."order" = ? AND l."order" = ?',
        [video.unit, video.lesson]
      );
      if (lesson) {
        insertVideo.run(lesson.id, video.title, video.url, video.order);
      }
    }

    console.log(`Seeded: ${videos.length} videos`);
  } else {
    console.log('Videos already seeded. Skipping.');
  }
}

seed();
