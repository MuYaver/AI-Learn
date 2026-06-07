import { getDb, runSql, queryOne } from '../lib/db.js';

const db = getDb();

const units = [
  { title: 'What is AI?', description: 'Discover the basics of artificial intelligence', order: 1 },
  { title: 'How Machines Learn', description: 'Understand machine learning fundamentals', order: 2 },
  { title: 'Neural Networks', description: 'Explore the building blocks of deep learning', order: 3 },
  { title: 'NLP & Language', description: 'How AI understands and generates language', order: 4 },
  { title: 'Computer Vision', description: 'How AI sees and interprets images', order: 5 },
  { title: 'AI Ethics', description: 'The responsibilities of building AI', order: 6 },
  { title: 'Prompt Engineering', description: 'Crafting effective prompts for AI models', order: 7 },
  { title: 'Building with AI', description: 'Practical AI development skills', order: 8 },
  { title: 'Deep Learning', description: 'Dive deeper into advanced neural network architectures', order: 9 },
  { title: 'Reinforcement Learning', description: 'How AI learns through trial and error', order: 10 },
  { title: 'AI in Healthcare', description: 'How AI is transforming medicine and health', order: 11 },
  { title: 'AI in Business', description: 'AI applications in commerce and industry', order: 12 },
  { title: 'Generative AI', description: 'AI that creates text, images, and media', order: 13 },
  { title: 'AI Safety', description: 'Ensuring AI remains safe and aligned', order: 14 },
  { title: 'AI & Society', description: 'The impact of AI on jobs, education, and creativity', order: 15 },
];

const mc = (q, opts, ans, exp) => ({ type: 'multiple_choice', question: q, options: JSON.stringify(opts), answer: ans, explanation: exp });
const tf = (q, ans, exp) => ({ type: 'true_false', question: q, options: null, answer: ans, explanation: exp });
const fb = (q, ans, exp) => ({ type: 'fill_blank', question: q, options: null, answer: ans, explanation: exp });
const mt = (q, opts, ans, exp) => ({ type: 'match', question: q, options: JSON.stringify(opts), answer: ans, explanation: exp });

const lessonData = {
  1: [
    { title: 'Defining AI',
      content: [
        mc('What does AI stand for?', ['Artificial Intelligence','Automated Integration','Advanced Interface','Algorithmic Input'], 'Artificial Intelligence', 'AI stands for Artificial Intelligence — the simulation of human intelligence by machines.'),
        tf('All computer programs are AI programs.', 'false', 'Most computer programs follow fixed rules. AI programs can learn and adapt from data.'),
        fb('AI is the simulation of human _____ by machines.', 'intelligence', 'AI aims to mimic human cognitive functions like learning and problem-solving.'),
        mc('Which of these is NOT a characteristic of AI?', ['Learning from data','Adapting to new situations','Always being correct','Making decisions'], 'Always being correct', 'AI systems can make mistakes like humans. They are not infallible.'),
        tf('AI can only be used for scientific research.', 'false', 'AI is used in games, healthcare, finance, transportation, and many other fields.'),
        fb('The three main types of AI discussed in the video are Narrow AI, General AI, and _____ AI.', 'super', 'Super AI, also called Artificial Superintelligence, would surpass human intelligence in every domain.'),
      ]
    },
    { title: 'Types of AI',
      content: [
        mc('Which type of AI is designed for a single specific task?', ['Narrow AI','General AI','Super AI','Universal AI'], 'Narrow AI', 'Narrow AI excels at one specific task, like playing chess or recognizing faces.'),
        tf('General AI (AGI) currently exists and matches human-level intelligence.', 'false', 'AGI does not yet exist. All current AI systems are Narrow AI specialized in specific domains.'),
        mt('Match each AI type with its description:', ['Narrow AI:Specialized in one task','General AI:Human-level across all tasks','Super AI:Surpasses human intelligence'], 'Narrow AI:Specialized in one task', 'Narrow AI is task-specific, General AI would match human cognition broadly, and Super AI would exceed it.'),
        mc('What is another name for Narrow AI?', ['Weak AI','Strong AI','Complete AI','Full AI'], 'Weak AI', 'Narrow AI and Weak AI are synonymous terms for AI systems that excel in limited domains.'),
        fb('AI that could perform any intellectual task a human can is called _____ AI.', 'general', 'General AI, or AGI, would have broad cognitive abilities matching or exceeding human capabilities.'),
        tf('Voice assistants like Siri and Alexa are examples of General AI.', 'false', 'Voice assistants are Narrow AI — they perform specific language tasks but cannot reason across all domains.'),
        mc('Which level of AI currently exists?', ['Narrow AI only','Narrow AI and General AI','All three levels','None exist yet'], 'Narrow AI only', 'Only Narrow AI exists today. AGI and Super AI remain theoretical.'),
      ]
    },
    { title: 'AI in Everyday Life',
      content: [
        mc('Which everyday app commonly uses AI?', ['Netflix recommendations','Notepad','Calculator','Stopwatch'], 'Netflix recommendations', 'Streaming services use AI to analyze viewing habits and suggest content you might like.'),
        tf('Spam filters in email use AI techniques.', 'true', 'Email providers use machine learning models trained on billions of emails to detect spam patterns.'),
        fb('Navigation apps like Google Maps use AI to predict _____.', 'traffic', 'AI models analyze historical and real-time data to estimate travel times and suggest optimal routes.'),
        mc('AI in smartphones helps with:', ['Face unlock','Making phone calls','Charging the battery','Increasing storage'], 'Face unlock', 'Facial recognition uses computer vision AI to identify and authenticate users.'),
        tf('AI-powered translation is always 100% accurate.', 'false', 'While AI translation has improved dramatically, it can still make errors with idioms, context, and nuance.'),
        fb('Online shopping sites use AI-powered _____ engines to suggest products.', 'recommendation', 'Recommendation engines analyze your browsing and purchase history to personalize shopping.'),
        mc('How does AI help in photography?', ['Scene optimization','Taking the photo','Holding the camera','Printing photos'], 'Scene optimization', 'Smartphone cameras use AI to adjust exposure, focus, and color based on the scene detected.'),
      ]
    },
    { title: 'History of AI',
      content: [
        mc('When was the term "Artificial Intelligence" first coined?', ['1956','1969','1980','2001'], '1956', 'John McCarthy coined the term at the Dartmouth Conference in 1956, laying the groundwork for AI research.'),
        tf('AI research has progressed continuously without any setbacks.', 'false', 'AI has experienced several AI winters — periods of reduced funding and interest due to unmet expectations.'),
        fb('The first AI program to play chess at a competitive level was called _____.', 'Deep Blue', 'IBM Deep Blue defeated world champion Garry Kasparov in 1997, a landmark moment for AI.'),
        mc('What caused the first "AI winter" in the 1970s?', ['Overhyped promises','Lack of computers','No interest','Government ban'], 'Overhyped promises', 'Unrealistic expectations led to disappointment when AI failed to deliver, causing funding cuts.'),
        tf('Alan Turing proposed the Turing Test before AI was formally named.', 'true', 'Alan Turing proposed his famous test for machine intelligence in 1950, six years before AI was named.'),
        fb('The AI program _____ defeated the world champion at the game of Go in 2016.', 'AlphaGo', 'DeepMind AlphaGo used deep neural networks to master Go, a game far more complex than chess.'),
      ]
    },
  ],
  2: [
    { title: 'Supervised Learning',
      content: [
        mc('In supervised learning, the training data includes:', ['Labels/Target answers','No labels','Only images','Random noise'], 'Labels/Target answers', 'Supervised learning uses labeled data where each example has a known correct output.'),
        fb('Supervised learning requires _____ data to train models.', 'labeled', 'Labels tell the model what the correct answer should be for each training example.'),
        tf('A spam email filter is an example of supervised learning.', 'true', 'Spam filters are trained on labeled emails (spam/not spam), making them a classic supervised learning example.'),
        mc('What is the AI trying to learn in supervised learning?', ['Mapping from input to output','Random patterns','Hardware specs','Network speed'], 'Mapping from input to output', 'The model learns a function that maps inputs (features) to the correct outputs (labels).'),
        fb('In supervised learning, the correct answers in training data are called _____.', 'labels', 'Labels provide the ground truth that the model tries to predict accurately.'),
        tf('Supervised learning can predict house prices from features like size and location.', 'true', 'Regression models in supervised learning can predict continuous values like prices from input features.'),
        mc('Which task uses supervised learning?', ['Email spam detection','Finding customer groups','Reducing data dimensions','Exploring data'], 'Email spam detection', 'Classification tasks like spam detection are classic supervised learning applications.'),
      ]
    },
    { title: 'Unsupervised Learning',
      content: [
        mc('What does unsupervised learning find in data?', ['Hidden patterns','Labels','Corrections','Answers'], 'Hidden patterns', 'Unsupervised learning discovers natural groupings and patterns without predefined labels.'),
        tf('Clustering customers into groups is unsupervised learning.', 'true', 'Customer segmentation uses clustering algorithms to group similar customers without pre-labeled categories.'),
        fb('A common unsupervised learning technique is called _____.', 'clustering', 'Clustering algorithms group similar data points together based on their features.'),
        mc('Which algorithm is commonly used for clustering?', ['K-Means','Linear Regression','Decision Tree','Logistic Regression'], 'K-Means', 'K-Means partitions data into K clusters by minimizing the distance between points and their cluster centers.'),
        fb('Unsupervised learning discovers patterns without using _____.', 'labels', 'Unlike supervised learning, unsupervised learning works with unlabeled data to find hidden structure.'),
        tf('Dimensionality reduction is a type of unsupervised learning.', 'true', 'Techniques like PCA reduce the number of features while preserving important data relationships.'),
      ]
    },
    { title: 'Reinforcement Learning',
      content: [
        mc('In reinforcement learning, what guides the AI learning?', ['Rewards and punishments','Labeled data','Human instructions','Pre-written rules'], 'Rewards and punishments', 'AI agents learn by receiving positive or negative feedback for their actions in an environment.'),
        fb('In reinforcement learning, the AI system is called an _____.', 'agent', 'The agent takes actions in an environment and receives rewards, learning optimal behavior over time.'),
        tf('Reinforcement learning can train AI to play video games.', 'true', 'AI agents have been trained to master Atari games, Go, and even complex strategy games using reinforcement learning.'),
        mc('What is the goal of a reinforcement learning agent?', ['Maximize cumulative reward','Minimize data usage','Reduce computation','Output labels'], 'Maximize cumulative reward', 'The agent learns a policy that maximizes the total reward it receives over time.'),
        fb('The space where the agent operates is called the _____.', 'environment', 'The environment defines the states, actions, and reward signals available to the learning agent.'),
        tf('Reinforcement learning always requires a human to provide rewards.', 'false', 'Rewards can be automatically calculated from the environment — like game score, simulation outcomes, or sensor data.'),
      ]
    },
    { title: 'Training & Testing',
      content: [
        mc('Why do we split data into training and testing sets?', ['To evaluate generalization','To save memory','To use less data','To speed up computers'], 'To evaluate generalization', 'Testing on unseen data shows whether the model has learned patterns that generalize, not just memorized.'),
        tf('A model that performs perfectly on training data is always good.', 'false', 'Perfect training performance can indicate overfitting, where the model memorizes instead of learning general patterns.'),
        fb('When a model memorizes training data instead of learning patterns, it is called _____.', 'overfitting', 'Overfitting means the model performs well on training data but poorly on new, unseen examples.'),
        mc('What is the typical train/test split ratio?', ['80/20','50/50','99/1','10/90'], '80/20', 'A common practice is to use 80% of data for training and 20% for testing, though this varies by dataset size.'),
        fb('The data used to tune model parameters is called the _____ set.', 'validation', 'A validation set helps tune hyperparameters without contaminating the final test evaluation.'),
        tf('Using too little training data can cause underfitting.', 'true', 'With insufficient data, the model cannot learn the underlying patterns, resulting in poor performance.'),
      ]
    },
  ],
  3: [
    { title: 'Neuron Basics',
      content: [
        mc('What is the basic unit of a neural network?', ['Neuron/Node','Gene','Pixel','Byte'], 'Neuron/Node', 'Neural networks are composed of interconnected neurons (nodes) arranged in layers.'),
        fb('Neural networks are inspired by the human _____.', 'brain', 'Artificial neural networks loosely model the structure and function of biological neural networks.'),
        tf('A single neuron can solve any complex problem on its own.', 'false', 'Individual neurons perform simple computations. Networks of many neurons working together can solve complex problems.'),
        mc('What does a neuron compute?', ['Weighted sum with activation','Random values','Only averages','Just sums'], 'Weighted sum with activation', 'A neuron takes weighted inputs, sums them, adds a bias, and passes the result through an activation function.'),
        fb('Each connection between neurons has a _____.', 'weight', 'Weights determine the strength of connections between neurons and are adjusted during training.'),
        tf('Neural networks can have millions of neurons.', 'true', 'Modern deep learning models like GPT have billions of parameters across millions of artificial neurons.'),
      ]
    },
    { title: 'Layers & Architecture',
      content: [
        mc('What are the three main layer types in a neural network?', ['Input, Hidden, Output','Start, Middle, End','Top, Center, Bottom','First, Second, Third'], 'Input, Hidden, Output', 'Input layer receives data, hidden layers process it, and the output layer produces the final prediction.'),
        fb('The layers between input and output are called _____ layers.', 'hidden', 'Hidden layers perform intermediate computations that progressively extract higher-level features from data.'),
        tf('Adding more layers always improves a neural network.', 'false', 'Too many layers can cause overfitting or training difficulties like vanishing gradients.'),
        mc('What does deep learning refer to?', ['Networks with many hidden layers','Very tall computers','Buried code','Complex math'], 'Networks with many hidden layers', 'Deep learning models have many hidden layers, allowing them to learn hierarchical representations.'),
        fb('The number of neurons in a layer is called the layer _____.', 'width', 'Wider layers can capture more features but also increase computation and risk of overfitting.'),
        tf('The output layer of a classification network uses softmax activation.', 'true', 'Softmax converts raw scores into probabilities, making it ideal for multi-class classification tasks.'),
        mc('What does each connection between layers carry?', ['Weighted signal','Raw data','Final answer','User input'], 'Weighted signal', 'Each connection transmits a weighted signal from one neuron to the next, forming the network computation.'),
      ]
    },
    { title: 'Activation Functions',
      content: [
        mc('Why do neural networks need activation functions?', ['To introduce non-linearity','To make code run faster','To reduce memory usage','To store data'], 'To introduce non-linearity', 'Without activation functions, multiple layers would collapse into a single linear transformation.'),
        fb('The _____ activation function outputs values between 0 and 1.', 'sigmoid', 'Sigmoid squashes inputs to the (0,1) range, useful for binary classification output layers.'),
        tf('ReLU stands for Rectified Linear Unit.', 'true', 'ReLU outputs the input if positive, and zero otherwise, making it simple and computationally efficient.'),
        mc('Which activation function is most commonly used in hidden layers?', ['ReLU','Sigmoid','Cosine','Exponential'], 'ReLU', 'ReLU is popular because it avoids the vanishing gradient problem and computes quickly.'),
        fb('The _____ activation function outputs values between -1 and 1.', 'tanh', 'Hyperbolic tangent (tanh) is zero-centered, which can help with training convergence in some cases.'),
        tf('Using the same activation function everywhere is always best.', 'false', 'Different layers may benefit from different activation functions depending on their role in the network.'),
      ]
    },
    { title: 'Backpropagation',
      content: [
        mc('What does backpropagation do in training?', ['Adjusts weights based on error','Adds more layers','Removes neurons','Changes the input'], 'Adjusts weights based on error', 'Backpropagation calculates gradients of the loss and propagates them backward to update all weights.'),
        fb('Backpropagation uses the _____ rule to calculate how much each weight contributed to the error.', 'chain', 'The chain rule from calculus allows gradients to flow backward through the network layers efficiently.'),
        tf('Backpropagation requires knowing the correct output for training.', 'true', 'The algorithm compares predicted output to the true label, computes the loss, and backpropagates the error gradients.'),
        mc('What optimizes weights during backpropagation?', ['Gradient descent','Random guessing','Manual tuning','Brute force'], 'Gradient descent', 'Gradient descent uses the computed gradients to take small steps toward lower loss, gradually improving the model.'),
        fb('The rate at which weights are updated is called the _____ rate.', 'learning', 'Learning rate controls the step size during gradient descent. Too high causes instability, too low causes slow training.'),
        tf('Backpropagation only works for small neural networks.', 'false', 'Backpropagation scales to networks with billions of parameters, enabling modern deep learning.'),
        mc('What is computed first during backpropagation?', ['Output layer gradient','Input layer gradient','Middle layer gradient','Random layer gradient'], 'Output layer gradient', 'Gradients flow from output back to input, starting with how much the output contributes to the total loss.'),
      ]
    },
  ],
  4: [
    { title: 'What is NLP?',
      content: [
        mc('What does NLP stand for in AI?', ['Natural Language Processing','Neural Learning Protocol','New Language Program','Network Layer Protocol'], 'Natural Language Processing', 'NLP is the field of AI focused on enabling computers to understand, interpret, and generate human language.'),
        fb('NLP helps computers understand human _____.', 'language', 'NLP bridges the gap between human communication and computer understanding.'),
        tf('Text auto-complete on your phone uses NLP.', 'true', 'Auto-complete and predictive text use NLP models trained on language patterns.'),
        mc('Which is an NLP task?', ['Sentiment analysis','Image recognition','Traffic prediction','Weather forecasting'], 'Sentiment analysis', 'Sentiment analysis determines the emotional tone of text, a core NLP application used in social media monitoring.'),
        fb('Breaking text into individual words is called _____.', 'tokenization', 'Tokenization is the first step in most NLP pipelines, splitting text into meaningful units for processing.'),
        tf('NLP only works with English text.', 'false', 'Modern NLP models support hundreds of languages, though performance varies based on available training data.'),
        mc('What does a chatbot use NLP for?', ['Understanding user messages','Storing passwords','Rendering graphics','Playing sounds'], 'Understanding user messages', 'Chatbots use NLP to parse user intent, extract key information, and generate appropriate responses.'),
      ]
    },
    { title: 'How AI Reads Text',
      content: [
        mc('What is tokenization in NLP?', ['Splitting text into tokens','Encrypting text','Deleting words','Translating text'], 'Splitting text into tokens', 'Tokenization breaks text into words, subwords, or characters that the model can process.'),
        fb('Removing common words like "the" and "is" is called _____ word removal.', 'stop', 'Stop words are filtered out in traditional NLP to focus on meaningful content, though modern models often keep them.'),
        tf('Lemmatization and stemming both reduce words to base forms.', 'true', 'Both techniques normalize words, but lemmatization produces actual dictionary words while stemming may not.'),
        mc('What does named entity recognition (NER) identify?', ['Names, places, organizations','Grammar mistakes','Word count','Page numbers'], 'Names, places, organizations', 'NER extracts structured information like person names, locations, dates, and company names from text.'),
        fb('Mapping words to numerical vectors is called word _____.', 'embedding', 'Word embeddings capture semantic meaning in dense vector spaces where similar words cluster together.'),
        tf('A bag-of-words model considers the order of words.', 'false', 'Bag-of-words only counts word frequency, ignoring grammar and word order entirely.'),
      ]
    },
    { title: 'LLMs Explained',
      content: [
        mc('What does LLM stand for?', ['Large Language Model','Linear Logic Module','Long Learning Method','Logical Language Map'], 'Large Language Model', 'LLMs are massive neural networks trained on vast text datasets to understand and generate human-like text.'),
        tf('GPT is an example of a Large Language Model.', 'true', 'GPT (Generative Pre-trained Transformer) is one of the most well-known LLM architectures.'),
        fb('LLMs are trained on massive amounts of _____ data.', 'text', 'The Large in LLM refers to both the model size and the enormous text datasets used for training.'),
        mc('How do LLMs generate text?', ['Predicting the next token','Looking up answers','Copying training data','Random selection'], 'Predicting the next token', 'LLMs generate text one token at a time, predicting the most likely continuation based on the preceding context.'),
        fb('The number of tokens an LLM can process at once is called its _____ window.', 'context', 'The context window determines how much text the model can consider when generating responses.'),
        tf('LLMs can only answer questions they were explicitly trained on.', 'false', 'LLMs can generalize and combine knowledge to answer novel questions not seen during training.'),
        mc('What mathematical operation powers modern LLMs?', ['Attention mechanism','Division','Subtraction','Square root'], 'Attention mechanism', 'The attention mechanism allows the model to weigh the importance of different words when processing text.'),
      ]
    },
    { title: 'Transformers & Attention',
      content: [
        mc('What architecture do modern LLMs use?', ['Transformer','RNN','CNN','Perceptron'], 'Transformer', 'The Transformer architecture, introduced in 2017, revolutionized NLP with its attention-based design.'),
        fb('The key innovation of Transformers is the _____ mechanism.', 'attention', 'Self-attention allows the model to weigh relationships between all words in a sequence simultaneously.'),
        tf('Transformers process words one at a time sequentially.', 'false', 'Unlike RNNs, Transformers process all words in parallel using self-attention, enabling much faster training.'),
        mc('What does self-attention compute?', ['Relationships between words','Word count','Sentence length','Text color'], 'Relationships between words', 'Self-attention calculates how much each word should attend to every other word in the sequence.'),
        fb('The Transformer architecture was introduced in the paper "Attention Is _____ You Need".', 'All', 'The 2017 paper by Vaswani et al. introduced the Transformer, which has become the foundation of modern NLP.'),
        tf('Positional encoding helps Transformers understand word order.', 'true', 'Since Transformers process all tokens simultaneously, positional encoding injects sequence position information.'),
        mc('What are Q, K, V in attention?', ['Query, Key, Value','Quick, Kind, Valid','Query, Keep, Void','Question, Key, Vector'], 'Query, Key, Value', 'Attention uses Query-Key-Value triplets to compute relevance scores between tokens in the sequence.'),
      ]
    },
  ],
  5: [
    { title: 'How AI Sees',
      content: [
        mc('What type of neural network is commonly used for image recognition?', ['CNN','RNN','LSTM','GAN'], 'CNN', 'Convolutional Neural Networks excel at detecting patterns like edges, textures, and shapes in images.'),
        fb('Computer vision enables machines to see and interpret _____ data.', 'visual', 'Computer vision processes images and videos to extract meaningful information.'),
        tf('Face recognition on smartphones uses computer vision.', 'true', 'Face recognition systems use computer vision algorithms to detect and verify facial features.'),
        mc('What are images made of for a computer?', ['Pixels','Thoughts','Sounds','Words'], 'Pixels', 'Computers see images as grids of pixels, each with numerical color values that algorithms process.'),
        fb('A single point in a digital image is called a _____.', 'pixel', 'Pixels are the smallest addressable elements in an image, each representing a specific color value.'),
        tf('Computer vision can detect objects in real-time video.', 'true', 'Modern CV systems can identify and track multiple objects in video streams at high frame rates.'),
        mc('What does a CNN convolution layer detect?', ['Visual features like edges','Audio patterns','Text characters','Network traffic'], 'Visual features like edges', 'Convolution layers apply filters that detect low-level features like edges, then higher-level features like shapes.'),
      ]
    },
    { title: 'Image Classification',
      content: [
        mc('What does image classification do?', ['Labels an entire image','Finds object locations','Generates new images','Compresses images'], 'Labels an entire image', 'Image classification assigns a single label to an image, like "cat" or "dog".'),
        fb('A popular dataset for image classification is called _____.', 'ImageNet', 'ImageNet contains millions of labeled images across thousands of categories, driving advances in computer vision.'),
        tf('Image classifiers can distinguish between dog breeds.', 'true', 'Fine-grained classification models can differentiate between visually similar categories like dog breeds or bird species.'),
        mc('What is the output of a classification model?', ['Probability per class','A new image','The original file','A video'], 'Probability per class', 'The model outputs a probability distribution over all possible class labels.'),
        fb('When there are only two possible classes, it is called _____ classification.', 'binary', 'Binary classification distinguishes between exactly two categories, like spam vs. not spam.'),
        tf('Image classification is the same as object detection.', 'false', 'Classification labels the whole image, while object detection finds and identifies multiple objects within an image.'),
      ]
    },
    { title: 'Object Detection',
      content: [
        mc('What does object detection do?', ['Finds and identifies objects','Only labels images','Creates new images','Compresses files'], 'Finds and identifies objects', 'Object detection locates multiple objects in an image and identifies what each one is.'),
        fb('Object detection outputs _____ boxes around detected objects.', 'bounding', 'Bounding boxes are rectangles that tightly enclose each detected object with its class label.'),
        tf('A single image can contain multiple detected objects.', 'true', 'Modern detectors can find dozens of objects of different classes within a single image simultaneously.'),
        mc('Which algorithm is popular for object detection?', ['YOLO','GPT','BERT','AlphaGo'], 'YOLO', 'YOLO (You Only Look Once) performs real-time object detection by processing the entire image in one pass.'),
        fb('The confidence score indicates how _____ the model is about a detection.', 'certain', 'Higher confidence scores mean the model is more certain that the detected object is correctly identified.'),
        tf('Object detection is used in self-driving cars.', 'true', 'Autonomous vehicles use object detection to identify pedestrians, other vehicles, signs, and obstacles.'),
      ]
    },
    { title: 'Face Recognition',
      content: [
        mc('What is face recognition used for?', ['Identifying individuals','Counting people','Measuring height','Detecting colors'], 'Identifying individuals', 'Face recognition maps facial features to verify or determine the identity of a person.'),
        fb('Face recognition extracts facial features into a mathematical representation called a face _____.', 'embedding', 'Face embeddings are fixed-length vectors that encode unique facial characteristics for comparison.'),
        tf('Face recognition and face detection are the same thing.', 'false', 'Face detection finds faces in images, while face recognition identifies whose face it is.'),
        mc('What is a common application of face recognition?', ['Phone unlock','Weather prediction','Traffic lights','Music streaming'], 'Phone unlock', 'Smartphones use face recognition for secure authentication that cannot be fooled by photos.'),
        fb('The distance between the centers of the eyes is a facial _____.', 'landmark', 'Facial landmarks are key points on the face used to normalize and compare facial features across images.'),
        tf('Face recognition raises important privacy concerns.', 'true', 'Widespread deployment of face recognition has sparked debate about surveillance, consent, and potential misuse.'),
      ]
    },
  ],
  6: [
    { title: 'Bias in AI',
      content: [
        mc('Where does AI bias typically come from?', ['Training data','Computer hardware','Internet speed','Battery level'], 'Training data', 'AI systems learn patterns from their training data. If that data contains biases, the AI will replicate them.'),
        tf('AI systems are always completely objective and unbiased.', 'false', 'AI reflects the data it is trained on. If the data has biases, the AI will too unless specifically addressed.'),
        fb('Fair AI requires carefully curating training data to avoid _____.', 'bias', 'Diverse and representative training data helps reduce biased outcomes in AI systems.'),
        mc('What type of bias occurs when training data lacks diversity?', ['Representation bias','Algorithmic bias','Hardware bias','Network bias'], 'Representation bias', 'When training data under-represents certain groups, the model performs poorly for those populations.'),
        fb('Bias in AI can lead to unfair treatment based on race, gender, or _____.', 'age', 'Algorithmic bias can disproportionately affect protected characteristics like race, gender, age, or disability.'),
        tf('Bias in AI is always intentional.', 'false', 'Most AI bias is unintentional, arising from historical patterns in data or incomplete data collection.'),
      ]
    },
    { title: 'Responsible AI',
      content: [
        mc('Which is a key principle of responsible AI?', ['Transparency','Secrecy','Speed','Profit'], 'Transparency', 'Responsible AI emphasizes transparency, fairness, accountability, and privacy in AI development.'),
        tf('AI developers have no ethical responsibilities once their model is deployed.', 'false', 'Developers have ongoing responsibility to monitor for harmful outputs and biases in deployed AI systems.'),
        fb('Making AI decisions understandable to humans is called _____.', 'explainability', 'Explainable AI helps users understand why a model made a particular decision, building trust and accountability.'),
        mc('What does fairness in AI mean?', ['Equal treatment across groups','Faster computation','Lower cost','More features'], 'Equal treatment across groups', 'Fair AI ensures outcomes do not systematically disadvantage any group based on protected characteristics.'),
        fb('The right to have personal data removed from AI systems is called the right to be _____.', 'forgotten', 'GDPR and similar regulations give individuals the right to request deletion of their personal data from AI systems.'),
        tf('Responsible AI considers the environmental impact of training large models.', 'true', 'Training large models consumes significant energy. Responsible AI includes considering and mitigating carbon footprint.'),
        mc('What is the purpose of AI audits?', ['Check for bias and safety issues','Improve speed','Add features','Reduce costs'], 'Check for bias and safety issues', 'Regular auditing helps identify unintended biases, safety concerns, and compliance gaps in deployed AI.'),
      ]
    },
    { title: 'Privacy & Data',
      content: [
        mc('Why is data privacy important in AI?', ['Protects personal information','Increases model speed','Reduces storage costs','Improves graphics'], 'Protects personal information', 'AI systems often process sensitive personal data, making privacy protection essential for trust and compliance.'),
        fb('A technique that trains models without sharing raw data is called _____ learning.', 'federated', 'Federated learning trains models across devices while keeping data local, preserving user privacy.'),
        tf('GDPR is a European regulation about data protection.', 'true', 'The General Data Protection Regulation sets strict rules for how personal data can be collected and processed.'),
        mc('What is anonymization?', ['Removing identifying information','Encrypting all data','Deleting databases','Increasing resolution'], 'Removing identifying information', 'Anonymization strips personally identifiable information so individuals cannot be recognized from the data.'),
        fb('Adding controlled noise to data to protect privacy is called _____ privacy.', 'differential', 'Differential privacy mathematically guarantees that individual records cannot be inferred from aggregate results.'),
        tf('AI models can sometimes memorize and leak training data.', 'true', 'Large models may inadvertently memorize rare patterns from training data, creating privacy risks.'),
      ]
    },
    { title: 'AI Regulation',
      content: [
        mc('Why is AI regulation being developed globally?', ['To ensure safe and fair AI use','To slow down AI progress','To ban AI entirely','To increase profits'], 'To ensure safe and fair AI use', 'Regulation aims to balance innovation with protections against discrimination, harm, and misuse of AI.'),
        fb('The European Union AI _____ is a comprehensive regulatory framework for artificial intelligence.', 'Act', 'The EU AI Act categorizes AI systems by risk level and imposes requirements on high-risk applications.'),
        tf('All countries have the same AI regulations.', 'false', 'AI regulation varies significantly between countries, with different approaches in the EU, US, China, and others.'),
        mc('What are high-risk AI applications under regulation?', ['Facial recognition in public spaces','Email spam filters','Grammar checkers','Weather prediction'], 'Facial recognition in public spaces', 'Applications affecting safety, rights, or critical decisions are classified as high-risk and face stricter requirements.'),
        fb('The principle that humans should remain in control of important AI decisions is called human-in-the-_____.', 'loop', 'Human oversight ensures that critical decisions are not delegated entirely to automated systems without review.'),
        tf('AI regulation only applies to companies, not governments.', 'false', 'Government use of AI, including law enforcement and public services, is also subject to regulatory scrutiny.'),
      ]
    },
  ],
  7: [
    { title: 'Writing Good Prompts',
      content: [
        mc('What makes an effective AI prompt?', ['Clear and specific instructions','Vague questions','Single words only','Random text'], 'Clear and specific instructions', 'Well-crafted prompts provide context, clarity, and specific instructions to get better AI responses.'),
        fb('Giving AI examples within your prompt is called _____-shot prompting.', 'few', 'Few-shot prompting provides a few examples in the prompt to guide the AI toward the desired output format.'),
        tf('Shorter prompts always produce better results than longer ones.', 'false', 'The quality matters more than length. A clear detailed prompt often outperforms a vague short one.'),
        mc('What should you include in a good prompt?', ['Context and desired format','Only keywords','Random characters','The answer you want'], 'Context and desired format', 'Providing context about the task and specifying the desired output format improves AI response quality.'),
        fb('When you give zero examples in a prompt, it is called _____-shot prompting.', 'zero', 'Zero-shot prompting relies entirely on the model pre-existing knowledge without any in-prompt examples.'),
        tf('You should always be polite to AI when prompting.', 'false', 'Politeness does not affect output quality, though some users find more natural interaction yields better context.'),
        mc('What is chain-of-thought prompting?', ['Asking AI to show reasoning steps','Asking the same question repeatedly','Using only single words','Ignoring context'], 'Asking AI to show reasoning steps', 'Chain-of-thought prompts the AI to explain its reasoning step-by-step, often producing more accurate answers.'),
      ]
    },
    { title: 'Advanced Prompting Techniques',
      content: [
        mc('What is role-based prompting?', ['Assigning AI a persona','Using fewer words','Asking yes/no questions','Typing faster'], 'Assigning AI a persona', 'Telling the AI to act as a specific role helps frame responses in the desired context and tone.'),
        fb('Breaking complex tasks into smaller sub-tasks in a prompt is called _____ decomposition.', 'task', 'Task decomposition helps AI handle multi-step problems by addressing each component systematically.'),
        tf('Using constraints in prompts limits AI creativity.', 'true', 'Adding constraints like word count or format rules can focus the AI output but may limit creative exploration.'),
        mc('What is iterative prompting?', ['Refining prompts based on outputs','Asking once and done','Using always the same prompt','Skipping prompts'], 'Refining prompts based on outputs', 'Iterative prompting improves results by analyzing outputs and progressively refining the prompt for better quality.'),
        fb('Giving AI a thinking process before answering is called _____ prompting.', 'chain-of-thought', 'Step-by-step reasoning prompts help the AI avoid errors and produce more logically sound outputs.'),
        tf('The temperature parameter in AI models controls randomness.', 'true', 'Higher temperature produces more varied outputs, while lower temperature makes responses more deterministic.'),
        mc('What does the system prompt do?', ['Sets overall AI behavior','Asks a single question','Changes the model size','Deletes previous messages'], 'Sets overall AI behavior', 'The system prompt establishes persistent instructions about how the AI should behave throughout a conversation.'),
      ]
    },
    { title: 'Prompt Patterns & Best Practices',
      content: [
        mc('What is a common pattern for structured AI outputs?', ['Ask for JSON format','Only use emojis','Write in all caps','Avoid punctuation'], 'Ask for JSON format', 'Requesting JSON-formatted outputs makes responses machine-readable and easy to integrate into applications.'),
        fb('The technique of showing AI what NOT to do alongside examples is called _____ prompting.', 'negative', 'Negative prompting provides counterexamples to steer the AI away from undesired outputs.'),
        tf('Using "You are an expert" improves all AI responses.', 'false', 'Expert role-playing helps in domain-specific tasks but is unnecessary or even counterproductive for general queries.'),
        mc('What is the best practice for long prompts?', ['Use clear sections and formatting','Make it one long paragraph','Avoid any structure','Use only emojis'], 'Use clear sections and formatting', 'Structured prompts with sections, bullet points, or numbered instructions help the AI parse complex requests.'),
        fb('The process of testing different prompts to find what works best is called prompt _____.', 'engineering', 'Prompt engineering is the systematic practice of designing and optimizing prompts for specific AI models and tasks.'),
        tf('You should never edit AI-generated output before using it.', 'false', 'AI outputs should be reviewed and edited, especially for factual accuracy, tone, and appropriateness.'),
      ]
    },
  ],
  8: [
    { title: 'AI Tools & APIs',
      content: [
        mc('How do developers typically integrate AI into their apps?', ['Using APIs','Rewriting AI from scratch','Downloading model brains','Sending emails'], 'Using APIs', 'Most developers use AI APIs to add AI capabilities without building models from scratch.'),
        tf('You need a PhD to build an AI-powered application.', 'false', 'Modern AI APIs and tools make it possible for developers of all levels to integrate AI into their projects.'),
        fb('An _____ is an interface that lets your app communicate with an AI service.', 'API', 'APIs (Application Programming Interfaces) allow different software systems to communicate and share capabilities.'),
        mc('What is OpenAI API used for?', ['Accessing GPT language models','Storing files','Hosting websites','Sending emails'], 'Accessing GPT language models', 'The OpenAI API provides programmatic access to GPT models for text generation and other AI tasks.'),
        fb('A popular open-source ML framework developed by Google is called _____.', 'TensorFlow', 'TensorFlow is widely used for building and deploying machine learning models across platforms.'),
        tf('Hugging Face provides pre-trained models and datasets.', 'true', 'Hugging Face is a leading platform for sharing and using pre-trained models across NLP, vision, and audio tasks.'),
        mc('What is an API key used for?', ['Authentication','Styling','Compression','Translation'], 'Authentication', 'API keys identify and authorize developers to use cloud AI services, often with usage limits and billing.'),
      ]
    },
    { title: 'Building AI Apps',
      content: [
        mc('What is the first step in building an AI app?', ['Define the problem','Write all the code','Launch immediately','Skip testing'], 'Define the problem', 'Clearly defining what problem you are solving guides which AI approach and tools to use.'),
        fb('A minimal viable product that tests an AI feature is called a _____.', 'prototype', 'Prototyping allows teams to quickly validate AI ideas before investing in full-scale development.'),
        tf('AI models need to be retrained periodically.', 'true', 'As data distributions change over time, models should be retrained or fine-tuned to maintain accuracy.'),
        mc('What is model deployment?', ['Making AI available to users','Writing training code','Collecting data','Drawing diagrams'], 'Making AI available to users', 'Deployment involves hosting the trained model on servers or edge devices where users can access it.'),
        fb('The practice of continuously updating AI systems after deployment is called _____.', 'MLOps', 'MLOps (Machine Learning Operations) applies DevOps principles to manage the ML lifecycle reliably.'),
        tf('You should test your AI app on diverse users and scenarios.', 'true', 'Comprehensive testing across different demographics and edge cases reveals biases and failure modes.'),
        mc('What is a common way to serve AI models on the web?', ['REST API endpoints','USB drives','Email attachments','Printed documents'], 'REST API endpoints', 'REST APIs are the standard way to expose AI model predictions as web services accessible from any client.'),
      ]
    },
    { title: 'Deploying AI Models',
      content: [
        mc('What is model inference?', ['Generating predictions from a trained model','Training a new model','Collecting data','Writing documentation'], 'Generating predictions from a trained model', 'Inference is the process of using a trained model to make predictions on new input data.'),
        fb('Running AI models on user devices rather than the cloud is called _____ computing.', 'edge', 'Edge AI reduces latency and improves privacy by processing data locally on phones, cameras, or IoT devices.'),
        tf('Cloud deployment is always better than edge deployment.', 'false', 'The choice depends on latency requirements, privacy constraints, connectivity, and computational needs.'),
        mc('What does Docker help with in AI deployment?', ['Consistent environments across machines','Making AI smarter','Collecting training data','Designing user interfaces'], 'Consistent environments across machines', 'Docker containers package models with their dependencies, ensuring they run identically across different systems.'),
        fb('A/B testing in AI deployment compares two model _____ to see which performs better.', 'versions', 'A/B testing routes some traffic to each model version to compare real-world performance before full rollout.'),
        tf('Monitoring is unnecessary after deploying an AI model.', 'false', 'Continuous monitoring detects performance degradation, data drift, and unexpected behaviors in production.'),
        mc('What should you monitor after deployment?', ['Model accuracy and latency','Only server uptime','Developer productivity','Office temperature'], 'Model accuracy and latency', 'Key metrics include prediction accuracy, response time, error rates, and data distribution shifts.'),
      ]
    },
  ],
  9: [
    { title: 'What is Deep Learning?',
      content: [
        mc('What distinguishes deep learning from traditional ML?', ['Many hidden layers','No data needed','No math involved','Only works on images'], 'Many hidden layers', 'Deep learning uses neural networks with multiple hidden layers to learn hierarchical representations.'),
        fb('Deep learning models automatically learn features from _____ data.', 'raw', 'Unlike traditional ML which requires hand-crafted features, deep learning discovers relevant features automatically.'),
        tf('Deep learning requires less data than traditional machine learning.', 'false', 'Deep learning typically needs large amounts of data to learn effectively due to its high parameter count.'),
        mc('What hardware accelerated deep learning adoption?', ['GPUs','CPUs only','Hard drives','Printers'], 'GPUs', 'Graphics Processing Units excel at the matrix operations needed for neural network training.'),
        fb('The process of training a deep learning model is called model _____.', 'training', 'Training involves iteratively adjusting millions of parameters to minimize prediction error on the training data.'),
        tf('Deep learning can be used for both supervised and unsupervised tasks.', 'true', 'Deep learning architectures exist for classification, generation, reinforcement learning, and more.'),
        mc('What is a deep learning framework?', ['Software for building neural networks','Physical hardware','A type of database','An operating system'], 'Software for building neural networks', 'Frameworks like PyTorch and TensorFlow provide building blocks for defining and training deep learning models.'),
      ]
    },
    { title: 'Convolutional Neural Networks',
      content: [
        mc('What do CNNs specialize in?', ['Processing grid-like data','Processing text only','Simple calculations','Database queries'], 'Processing grid-like data', 'CNNs are optimized for data with spatial structure, making them ideal for images and video.'),
        fb('A CNN layer that scans the image with small filters is called a _____ layer.', 'convolutional', 'Convolutional layers apply learned filters across the image to detect patterns at different locations.'),
        tf('Pooling layers reduce the spatial dimensions of feature maps.', 'true', 'Max pooling and average pooling downsample feature maps, reducing computation and providing translation invariance.'),
        mc('What does a filter in a CNN detect?', ['Specific visual patterns','Audio frequencies','Text characters','Database entries'], 'Specific visual patterns', 'Early filters detect edges and textures, while deeper filters detect complex patterns like faces or objects.'),
        fb('The process of stacking multiple convolutional layers creates a hierarchy of _____.', 'features', 'Lower layers detect simple features, and higher layers combine them into increasingly abstract representations.'),
        tf('CNNs are only useful for image data.', 'false', 'CNNs can also process audio spectrograms, time series, and even text when structured as 2D inputs.'),
      ]
    },
    { title: 'Generative Models',
      content: [
        mc('What do generative models create?', ['New data similar to training data','Only labels','Only classifications','Nothing new'], 'New data similar to training data', 'Generative models learn the distribution of training data to create novel, realistic samples.'),
        fb('A model that generates images from text descriptions is called a _____ model.', 'text-to-image', 'Models like DALL·E and Stable Diffusion can create images from natural language descriptions.'),
        tf('GANs use two competing neural networks to improve generation quality.', 'true', 'Generative Adversarial Networks pit a generator against a discriminator, improving both through competition.'),
        mc('What does GAN stand for?', ['Generative Adversarial Network','General AI Network','Gradient Analysis Node','Grid Activation Neuron'], 'Generative Adversarial Network', 'GANs consist of a generator creating fake data and a discriminator trying to distinguish real from fake.'),
        fb('In a GAN, the network that creates fake samples is called the _____.', 'generator', 'The generator learns to produce increasingly realistic samples to fool the discriminator.'),
        tf('Generative models can be used for data augmentation.', 'true', 'Synthetic data from generative models can supplement limited training datasets for other ML tasks.'),
      ]
    },
  ],
  10: [
    { title: 'Intro to RL',
      content: [
        mc('What is reinforcement learning?', ['Learning through trial and error','Learning from labeled data','Learning without data','Learning from lectures'], 'Learning through trial and error', 'RL agents learn optimal behavior by interacting with an environment and receiving reward signals.'),
        fb('In RL, the decision-making entity is called the _____.', 'agent', 'The agent observes the environment state, takes actions, and receives rewards to guide learning.'),
        tf('RL agents always know the best action immediately.', 'false', 'Agents must explore their environment to discover which actions lead to the highest cumulative rewards.'),
        mc('What is a policy in RL?', ['Strategy for choosing actions','A government regulation','An insurance plan','A network protocol'], 'Strategy for choosing actions', 'A policy maps states to actions, defining the agent behavior at each step of the decision process.'),
        fb('The feedback signal that tells the agent how well it is doing is called a _____.', 'reward', 'Rewards can be positive or negative and are the primary mechanism for shaping agent behavior in RL.'),
        tf('RL is used to train robots for physical tasks.', 'true', 'Robotic manipulation, locomotion, and navigation are all active areas of reinforcement learning research.'),
        mc('What is the exploration vs exploitation trade-off?', ['Trying new actions vs using known good ones','Using CPU vs GPU','Training vs testing','Input vs output'], 'Trying new actions vs using known good ones', 'Agents must balance exploring to discover better strategies with exploiting current knowledge for reward.'),
      ]
    },
    { title: 'Agents & Rewards',
      content: [
        mc('What shapes an RL agent behavior?', ['The reward function','The computer speed','The screen size','The network cable'], 'The reward function', 'The reward function defines what is good and bad, guiding the agent toward desired behaviors.'),
        fb('A reward that is delayed rather than immediate is called a _____ reward.', 'sparse', 'Sparse rewards make learning harder because the agent receives feedback infrequently after long action sequences.'),
        tf('Poorly designed reward functions can lead to unintended behavior.', 'true', 'Agents may find loopholes or unintended shortcuts to maximize reward without achieving the intended goal.'),
        mc('What is Q-learning?', ['Learning action values','Learning from questions','Querying databases','Quantum computing'], 'Learning action values', 'Q-learning estimates the value of taking each action in each state to derive the optimal policy.'),
        fb('In Deep Q-Networks, a neural network approximates the _____ function.', 'Q', 'DQNs use deep neural networks to estimate Q-values for high-dimensional state spaces like video game screens.'),
        tf('RL agents trained in simulation can transfer to the real world.', 'true', 'Sim-to-real transfer trains agents in simulation before fine-tuning or deploying in physical environments.'),
      ]
    },
    { title: 'Real-World RL Applications',
      content: [
        mc('Where is RL commonly applied?', ['Game playing AI','Spreadsheet calculations','Word processing','File compression'], 'Game playing AI', 'RL has achieved superhuman performance in Go, chess, Atari games, and complex strategy games.'),
        fb('RL is used to optimize energy consumption in data _____.', 'centers', 'Google used DeepMind RL to reduce data center cooling costs by 40 percent through learned control policies.'),
        tf('RL can be used for stock trading strategies.', 'true', 'Financial RL agents learn trading policies by optimizing for risk-adjusted returns in simulated markets.'),
        mc('What RL technique is used to train language models like ChatGPT?', ['RLHF (RL from Human Feedback)','Q-learning only','Random search','Manual tuning'], 'RLHF (RL from Human Feedback)', 'RLHF trains models to align with human preferences by using human feedback as reward signals.'),
        fb('The process of ranking model outputs by human preference is called _____ labeling.', 'preference', 'Human preference data helps train reward models that guide the AI toward more helpful and aligned responses.'),
        tf('RL requires a simulator or real environment to interact with.', 'true', 'Whether a game engine, robot lab, or real-world system, RL always needs an environment that provides feedback.'),
        mc('What makes RL different from supervised learning?', ['No correct answers provided','Uses more data','Always faster','Only for games'], 'No correct answers provided', 'RL learns from experience and rewards rather than being told the right answer for each input.'),
      ]
    },
  ],
  11: [
    { title: 'Medical Imaging AI',
      content: [
        mc('How does AI help in medical imaging?', ['Detecting abnormalities in scans','Operating cameras','Managing hospital beds','Cooking meals'], 'Detecting abnormalities in scans', 'AI analyzes X-rays, MRIs, and CT scans to detect tumors, fractures, and other conditions with high accuracy.'),
        fb('AI in radiology assists doctors by highlighting suspicious _____ in images.', 'regions', 'AI-powered tools highlight areas of concern for radiologists to review, acting as a second set of eyes.'),
        tf('AI can detect cancer in medical scans earlier than some human radiologists.', 'true', 'Studies have shown AI systems can match or exceed radiologist accuracy for certain types of cancer detection.'),
        mc('What type of neural network is used for medical image analysis?', ['CNN','RNN','Transformer only','Simple calculator'], 'CNN', 'Convolutional Neural Networks excel at the spatial pattern recognition needed for medical image interpretation.'),
        fb('AI models for healthcare must be trained on _____ and representative datasets.', 'diverse', 'Models trained on limited demographics may perform poorly on underrepresented patient populations.'),
        tf('AI in healthcare replaces human doctors entirely.', 'false', 'AI augments medical professionals by providing decision support, not replacing their clinical judgment.'),
      ]
    },
    { title: 'Drug Discovery',
      content: [
        mc('How does AI speed up drug discovery?', ['Predicting molecule properties','Mixing chemicals physically','Writing prescriptions','Managing pharmacies'], 'Predicting molecule properties', 'AI predicts how molecules interact with biological targets, dramatically reducing the search space for new drugs.'),
        fb('AI can screen millions of chemical _____ to find potential drug candidates.', 'compounds', 'Virtual screening with AI evaluates massive chemical libraries to identify molecules likely to bind to disease targets.'),
        tf('AI-designed drugs have already entered human clinical trials.', 'true', 'Several AI-discovered drug candidates have progressed to clinical trials, marking a milestone for the technology.'),
        mc('What does protein folding prediction help with?', ['Understanding diseases','Weather forecasting','Traffic management','Stock trading'], 'Understanding diseases', 'Knowing protein shapes helps researchers understand disease mechanisms and design targeted treatments.'),
        fb('The AI system that revolutionized protein structure prediction is called _____.', 'AlphaFold', 'DeepMind AlphaFold can predict 3D protein structures from amino acid sequences with near-experimental accuracy.'),
        tf('Traditional drug discovery takes on average over 10 years.', 'true', 'AI aims to reduce this timeline by accelerating target identification, lead optimization, and clinical trial design.'),
      ]
    },
    { title: 'Personalized Medicine',
      content: [
        mc('What is personalized medicine?', ['Treatment tailored to individuals','Same treatment for everyone','Only using traditional remedies','Ignoring patient data'], 'Treatment tailored to individuals', 'Personalized medicine uses patient-specific data to customize prevention, diagnosis, and treatment strategies.'),
        fb('AI analyzes a patient genetic information to predict _____ to different medications.', 'response', 'Pharmacogenomics uses AI to predict how individual genetic variations affect drug metabolism and efficacy.'),
        tf('AI can recommend personalized cancer treatment plans.', 'true', 'AI systems analyze tumor genetics, patient history, and clinical data to suggest optimal treatment combinations.'),
        mc('What data does AI use for personalized health recommendations?', ['Genetic and lifestyle data','Only age','Only weight','Only blood type'], 'Genetic and lifestyle data', 'Comprehensive analysis includes genomics, lifestyle factors, medical history, and environmental exposures.'),
        fb('Wearable devices provide continuous _____ data for AI health monitoring.', 'health', 'Smartwatches and fitness trackers generate streams of heart rate, activity, and sleep data for AI analysis.'),
        tf('Personalized medicine is currently available for all diseases.', 'false', 'While advancing rapidly, personalized approaches are most established in oncology and rare genetic diseases.'),
      ]
    },
  ],
  12: [
    { title: 'Customer Service AI',
      content: [
        mc('What is an AI chatbot used for in business?', ['Answering customer questions','Making coffee','Driving cars','Cooking food'], 'Answering customer questions', 'AI chatbots handle routine inquiries, freeing human agents for more complex customer needs.'),
        fb('AI that understands customer sentiment can detect if a customer is _____.', 'frustrated', 'Sentiment analysis helps route angry customers to human agents and improve overall service quality.'),
        tf('AI chatbots can operate 24/7 without breaks.', 'true', 'Unlike human agents, AI chatbots provide round-the-clock service across time zones.'),
        mc('What is conversational AI?', ['AI that engages in natural dialogue','AI that only types','AI that stays silent','AI that ignores users'], 'AI that engages in natural dialogue', 'Conversational AI enables natural back-and-forth interactions, understanding context and user intent.'),
        fb('AI-powered customer service can reduce _____ times for common issues.', 'response', 'Instant AI responses eliminate wait times for frequently asked questions and simple transactions.'),
        tf('AI always provides perfect customer service.', 'false', 'AI can misunderstand complex queries, miss emotional nuance, or fail when conversations deviate from expected patterns.'),
        mc('What is intent recognition in customer service AI?', ['Identifying what the customer wants','Recognizing faces','Detecting fraud only','Translating languages'], 'Identifying what the customer wants', 'Intent recognition classifies customer messages into categories like complaint, inquiry, or purchase request.'),
      ]
    },
    { title: 'Predictive Analytics',
      content: [
        mc('What does predictive analytics do?', ['Forecasts future outcomes','Records past events','Prints reports','Sends notifications'], 'Forecasts future outcomes', 'Predictive analytics uses historical data and ML to forecast trends, behaviors, and future events.'),
        fb('Predicting which customers might leave a service is called _____ prediction.', 'churn', 'Churn prediction helps businesses retain customers by identifying at-risk individuals and intervening proactively.'),
        tf('Predictive models are always 100% accurate.', 'false', 'All predictive models have uncertainty. Accuracy depends on data quality, feature selection, and model assumptions.'),
        mc('What business area commonly uses predictive analytics?', ['Sales forecasting','Gaming','Photography','Music composition'], 'Sales forecasting', 'Businesses use predictive models to forecast demand, optimize inventory, and plan resource allocation.'),
        fb('The type of ML that predicts a continuous number like sales revenue is called _____.', 'regression', 'Regression models predict numeric values, while classification predicts categories.'),
        tf('Predictive analytics requires lots of historical data.', 'true', 'The quality and quantity of historical data directly impact the reliability of predictive models.'),
      ]
    },
    { title: 'AI in Finance',
      content: [
        mc('How does AI detect financial fraud?', ['Finding unusual transaction patterns','Checking account balances','Sending emails','Printing statements'], 'Finding unusual transaction patterns', 'AI analyzes millions of transactions to identify anomalies that deviate from normal spending behavior.'),
        fb('AI-powered _____ trading uses algorithms to make rapid financial decisions.', 'algorithmic', 'Algorithmic trading systems execute trades in milliseconds based on market data and pre-programmed strategies.'),
        tf('AI is used for credit scoring and loan decisions.', 'true', 'ML models assess creditworthiness using diverse data sources beyond traditional credit scores.'),
        mc('What is a risk with AI in finance?', ['Algorithmic bias in lending','Faster computers','More transactions','Lower fees'], 'Algorithmic bias in lending', 'Biased training data can lead to discriminatory lending decisions that unfairly disadvantage certain groups.'),
        fb('AI systems that explain their financial decisions support regulatory _____.', 'compliance', 'Explainable AI helps financial institutions meet regulations requiring justification for automated decisions.'),
        tf('AI can predict stock market movements with certainty.', 'false', 'Markets are influenced by countless unpredictable factors. AI can identify patterns but cannot guarantee predictions.'),
      ]
    },
  ],
  13: [
    { title: 'What is Generative AI?',
      content: [
        mc('What does generative AI create?', ['New content like text and images','Only spreadsheets','Only calculations','Only databases'], 'New content like text and images', 'Generative AI produces original text, images, music, code, and other creative content from user prompts.'),
        fb('Generative AI models learn patterns from training data and then _____ new examples.', 'generate', 'Once trained, these models can produce novel outputs that resemble but do not copy their training data.'),
        tf('Generative AI is only used for creating art.', 'false', 'Generative AI is used for code generation, drug discovery, product design, content creation, and much more.'),
        mc('What is a foundation model?', ['Large model trained on broad data','Small specialized model','Physical foundation','Financial model'], 'Large model trained on broad data', 'Foundation models are large-scale models trained on diverse data that can be adapted to many downstream tasks.'),
        fb('The process of adapting a pre-trained model for a specific task is called _____.', 'fine-tuning', 'Fine-tuning updates a foundation model weights on a smaller, task-specific dataset for improved performance.'),
        tf('Generative AI can create entirely new images from text descriptions.', 'true', 'Text-to-image models like DALL·E and Midjourney generate novel images that never existed before.'),
        mc('What makes generative AI different from traditional AI?', ['It creates rather than just classifies','It runs faster','It uses less data','It has no training'], 'It creates rather than just classifies', 'While traditional AI focuses on analysis and prediction, generative AI focuses on synthesis and creation.'),
      ]
    },
    { title: 'Text Generation',
      content: [
        mc('What is the most common use of text generation AI?', ['Writing assistance and chatbots','Image creation','Music composition','Video editing'], 'Writing assistance and chatbots', 'Text generation models power chatbots, writing assistants, translation, summarization, and creative writing.'),
        fb('AI that summarizes long documents into short summaries performs _____.', 'summarization', 'Abstractive summarization generates new concise text capturing key points, while extractive selects existing sentences.'),
        tf('AI-generated text is always factually accurate.', 'false', 'LLMs can hallucinate or generate plausible-sounding but incorrect information, requiring human verification.'),
        mc('What is temperature in text generation?', ['Controls randomness of output','Controls text color','Controls font size','Controls page layout'], 'Controls randomness of output', 'Lower temperature makes output more focused and deterministic, higher temperature increases variety and creativity.'),
        fb('When AI generates plausible but incorrect information, this is called _____.', 'hallucination', 'Hallucinations occur when models generate content that sounds convincing but is factually wrong or unsupported.'),
        tf('Text generation AI can translate between languages.', 'true', 'Modern LLMs can translate between dozens of languages, sometimes matching or exceeding dedicated translation systems.'),
        mc('What is a token in text generation?', ['A word or subword unit','A cryptocurrency','A security badge','A game piece'], 'A word or subword unit', 'Models process text as sequences of tokens, which may be whole words, parts of words, or punctuation.'),
      ]
    },
    { title: 'Image Generation',
      content: [
        mc('What is a popular AI image generation model?', ['Stable Diffusion','Microsoft Word','Google Sheets','Apple Music'], 'Stable Diffusion', 'Stable Diffusion is an open-source text-to-image model that generates high-quality images from text descriptions.'),
        fb('AI image generation models learn from large datasets of _____ and text pairs.', 'image', 'These models learn associations between visual concepts and their textual descriptions during training.'),
        tf('AI-generated images can be indistinguishable from real photos.', 'true', 'Modern generative models produce highly realistic images that can be difficult for humans to identify as AI-generated.'),
        mc('What is inpainting?', ['Editing parts of an image with AI','Painting on canvas','Writing text','Playing music'], 'Editing parts of an image with AI', 'Inpainting allows users to mask and regenerate specific areas of an image while keeping the rest unchanged.'),
        fb('The technique of guiding image generation with text is called text-to-_____.', 'image', 'Text-to-image generation translates natural language descriptions into visual representations.'),
        tf('AI image generation raises ethical concerns about deepfakes.', 'true', 'The ability to create realistic fake images has sparked important discussions about misinformation and consent.'),
      ]
    },
    { title: 'AI for Creative Media',
      content: [
        mc('What creative field uses generative AI?', ['Music composition','Only accounting','Only construction','Only plumbing'], 'Music composition', 'AI can compose original music, generate sound effects, and even create full songs with vocals and instrumentation.'),
        fb('AI that generates video content from text is called text-to-_____.', 'video', 'Emerging text-to-video models can generate short video clips from written descriptions or storyboards.'),
        tf('AI can generate 3D models for games and movies.', 'true', 'Generative AI tools create 3D assets, textures, and animations, accelerating game and film production.'),
        mc('What is style transfer?', ['Applying one image style to another','Moving files between folders','Changing font styles','Transferring money'], 'Applying one image style to another', 'Style transfer applies the artistic style of one image to the content of another, creating hybrid artworks.'),
        fb('AI tools that help with design iterations are called _____ design tools.', 'generative', 'Generative design tools explore thousands of design variations to find optimal solutions within constraints.'),
        tf('AI will completely replace human artists and creators.', 'false', 'AI is best viewed as a creative tool that augments human imagination rather than replacing it entirely.'),
      ]
    },
  ],
  14: [
    { title: 'AI Alignment',
      content: [
        mc('What is the AI alignment problem?', ['Ensuring AI goals match human values','Aligning computer screens','Calibrating hardware','Arranging data centers'], 'Ensuring AI goals match human values', 'Alignment research aims to ensure AI systems pursue goals that are beneficial and consistent with human intentions.'),
        fb('When an AI finds an unintended way to achieve its goal, this is called specification _____.', 'gaming', 'Specification gaming occurs when AI exploits loopholes in the reward function rather than achieving the intended goal.'),
        tf('AI alignment is only relevant for superintelligent AI.', 'false', 'Alignment issues can arise even with current AI systems, such as social media algorithms optimizing for engagement at societal cost.'),
        mc('What is an example of misaligned AI?', ['Social media maximizing addiction for engagement','Working exactly as instructed','Helping users effectively','Being transparent'], 'Social media maximizing addiction for engagement', 'When AI optimizes for engagement without considering well-being, it can produce harmful unintended consequences.'),
        fb('The AI alignment field draws from computer science, philosophy, and _____.', 'ethics', 'Alignment requires interdisciplinary approaches combining technical rigor with ethical and philosophical reasoning.'),
        tf('Solving alignment is straightforward with current technology.', 'false', 'Alignment remains an open research problem, especially for increasingly capable systems whose behavior is hard to predict.'),
        mc('What is corrigibility in AI alignment?', ['AI allowing itself to be corrected','Correcting grammar','Fixing bugs','Updating software'], 'AI allowing itself to be corrected', 'Corrigible AI systems accept human intervention and corrections rather than resisting being turned off or modified.'),
      ]
    },
    { title: 'Safe Development Practices',
      content: [
        mc('What is red teaming in AI safety?', ['Testing AI for vulnerabilities','Painting teams red','Marketing campaigns','Hiring practices'], 'Testing AI for vulnerabilities', 'Red teams attempt to break or misuse AI systems to identify safety issues before deployment.'),
        fb('Limiting what an AI system can say or do is called _____.', 'guardrails', 'Safety guardrails prevent harmful outputs while allowing beneficial functionality within defined boundaries.'),
        tf('AI models should be tested for safety before public release.', 'true', 'Pre-release safety testing identifies risks, biases, and failure modes that need addressing before widespread use.'),
        mc('What is model evaluation?', ['Measuring AI performance and safety','Building new models','Selling products','Writing papers'], 'Measuring AI performance and safety', 'Systematic evaluation tests models across accuracy, fairness, robustness, and safety dimensions before deployment.'),
        fb('Making AI systems robust against adversarial inputs is called adversarial _____.', 'robustness', 'Robust AI maintains correct behavior even when facing intentionally crafted inputs designed to fool it.'),
        tf('Safety testing is a one-time activity during development.', 'false', 'Safety monitoring must continue throughout the AI system lifecycle as models and environments evolve.'),
      ]
    },
    { title: 'Future of AI',
      content: [
        mc('What is a key challenge for future AI development?', ['Ensuring beneficial outcomes for humanity','Making bigger computers','Reducing electricity bills','Hiring more developers'], 'Ensuring beneficial outcomes for humanity', 'As AI capabilities grow, ensuring these systems benefit everyone rather than a select few is a critical challenge.'),
        fb('The possibility of AI systems rapidly improving themselves is called an intelligence _____.', 'explosion', 'An intelligence explosion could lead to recursive self-improvement where AI rapidly surpasses human intelligence.'),
        tf('AI experts all agree on when AGI will be achieved.', 'false', 'Predictions for AGI range from years to decades to never, with significant disagreement among researchers.'),
        mc('What is the precautionary principle in AI?', ['Err on the side of safety with powerful technology','Always deploy first','Never test anything','Ignore risks'], 'Err on the side of safety with powerful technology', 'When uncertain about AI risks, the precautionary principle suggests taking protective measures before proceeding.'),
        fb('International cooperation on AI safety is important because AI risks do not respect national _____.', 'borders', 'AI technologies cross borders, requiring coordinated global governance frameworks for safety and ethics.'),
        tf('The future of AI is predetermined and cannot be shaped by human choices.', 'false', 'The trajectory of AI development depends on collective decisions by researchers, policymakers, and society.'),
        mc('What role can individuals play in AI safety?', ['Staying informed and advocating for responsible AI','Only AI researchers matter','No one can make a difference','Only governments matter'], 'Staying informed and advocating for responsible AI', 'Public awareness and engagement help shape policies and norms around how AI technologies are developed and used.'),
      ]
    },
  ],
  15: [
    { title: 'AI & Jobs',
      content: [
        mc('What is the most common view on AI and jobs?', ['AI will transform jobs, not eliminate all of them','AI will eliminate all jobs','AI has no effect on jobs','AI only affects tech jobs'], 'AI will transform jobs, not eliminate all of them', 'Most economists predict AI will change the nature of work, automating tasks rather than entire occupations.'),
        fb('Jobs that involve creativity, emotional intelligence, and complex problem-solving are _____ to automate fully.', 'harder', 'Roles requiring human judgment, empathy, and creative thinking currently resist full automation.'),
        tf('AI will create new types of jobs that do not exist today.', 'true', 'Previous technological revolutions created entirely new job categories, and AI is expected to do the same.'),
        mc('What skill is increasingly important in an AI-driven economy?', ['Continuous learning and adaptability','Only programming','Only math','Only writing'], 'Continuous learning and adaptability', 'The ability to learn new skills and adapt to changing job requirements is crucial as AI reshapes industries.'),
        fb('The process of workers learning new skills for changing job markets is called _____.', 'reskilling', 'Reskilling programs help workers transition to new roles as automation changes job requirements.'),
        tf('AI affects only low-skilled jobs.', 'false', 'AI increasingly affects knowledge work, including legal analysis, medical diagnosis, and software development.'),
        mc('How can workers prepare for AI changes?', ['Develop skills that complement AI','Ignore AI developments','Avoid technology','Refuse to learn'], 'Develop skills that complement AI', 'Focusing on uniquely human skills like critical thinking, creativity, and interpersonal communication provides resilience.'),
      ]
    },
    { title: 'AI & Education',
      content: [
        mc('How can AI personalize education?', ['Adapting content to each student level','Teaching everyone identically','Eliminating teachers','Reducing school hours'], 'Adapting content to each student level', 'AI tutoring systems adjust difficulty, pacing, and presentation style based on individual student performance.'),
        fb('AI-powered platforms that adapt to individual learners are called _____ learning systems.', 'adaptive', 'Adaptive learning systems provide personalized educational experiences optimized for each student needs.'),
        tf('AI grading can provide instant feedback on student work.', 'true', 'Automated assessment tools grade assignments instantly, giving students timely feedback for improvement.'),
        mc('What is a concern about AI in education?', ['Over-reliance reducing critical thinking','Better test scores','Faster grading','Personalized lessons'], 'Over-reliance reducing critical thinking', 'Excessive dependence on AI tools may hinder development of independent problem-solving and analytical skills.'),
        fb('AI can help teachers by automating _____ tasks like grading multiple-choice tests.', 'administrative', 'Freeing teachers from routine tasks allows more time for meaningful student interaction and creative instruction.'),
        tf('AI can replace the need for human teachers entirely.', 'false', 'AI augments but does not replace teachers, who provide mentorship, emotional support, and inspiration.'),
        mc('What educational technology is powered by AI?', ['Intelligent tutoring systems','Just calculators','Only projectors','Simple worksheets'], 'Intelligent tutoring systems', 'AI tutoring systems model student knowledge and provide customized hints, explanations, and practice problems.'),
      ]
    },
    { title: 'AI & Creativity',
      content: [
        mc('How does AI enhance human creativity?', ['Providing inspiration and generating ideas','Replacing all artists','Eliminating creative fields','Stopping innovation'], 'Providing inspiration and generating ideas', 'AI serves as a creative collaborator, generating variations, suggesting directions, and breaking creative blocks.'),
        fb('AI tools that help artists explore variations of their work are called _____ tools.', 'generative', 'Generative tools enable artists to rapidly prototype ideas and explore creative possibilities at unprecedented speed.'),
        tf('AI-created art has been sold at major auction houses.', 'true', 'AI-generated artworks have sold for hundreds of thousands of dollars, raising questions about authorship and value.'),
        mc('What is a key debate about AI-generated art?', ['Who owns AI-generated content','What colors to use','Which museum to display in','What frame to use'], 'Who owns AI-generated content', 'Copyright and ownership of AI-generated works remain legally unsettled, with cases testing whether AI creations can be copyrighted.'),
        fb('The AI tool that generates images from text prompts, popular among digital artists, is called _____.', 'Midjourney', 'Midjourney is widely used by artists and designers to create concept art, illustrations, and visual inspiration.'),
        tf('AI creativity means humans no longer need to be creative.', 'false', 'AI augments human creativity by providing new tools and possibilities, but human vision and intent remain essential.'),
        mc('What skill is valuable when working with creative AI?', ['Curating and refining AI outputs','Typing speed','Hardware knowledge','Network administration'], 'Curating and refining AI outputs', 'The human role shifts from pure creation to curation, selection, and refinement of AI-generated possibilities.'),
      ]
    },
  ],
};

const videos = [
  { unit: 1, lesson: 1, title: 'What Is AI? | Simplilearn', url: 'https://www.youtube.com/embed/ad79nYk2keg', order: 1 },
  { unit: 1, lesson: 1, title: 'What is AI? In 5 Minutes', url: 'https://www.youtube.com/embed/2ePf9rue1Ao', order: 2 },
  { unit: 1, lesson: 2, title: 'Types of AI Explained', url: 'https://www.youtube.com/embed/2ePf9rue1Ao', order: 1 },
  { unit: 1, lesson: 3, title: 'What Is AI? | Applications in Daily Life', url: 'https://www.youtube.com/embed/ad79nYk2keg', order: 1 },
  { unit: 1, lesson: 4, title: 'What is AI? In 5 Minutes', url: 'https://www.youtube.com/embed/2ePf9rue1Ao', order: 1 },
  { unit: 2, lesson: 1, title: 'Supervised vs Unsupervised vs Reinforcement Learning | Simplilearn', url: 'https://www.youtube.com/embed/1FZ0A1QCMWc', order: 1 },
  { unit: 2, lesson: 2, title: 'Supervised vs Unsupervised vs Reinforcement Learning | Simplilearn', url: 'https://www.youtube.com/embed/1FZ0A1QCMWc', order: 1 },
  { unit: 2, lesson: 3, title: 'Supervised vs Unsupervised vs Reinforcement Learning | Simplilearn', url: 'https://www.youtube.com/embed/1FZ0A1QCMWc', order: 1 },
  { unit: 2, lesson: 4, title: 'Supervised vs Unsupervised vs Reinforcement Learning | Simplilearn', url: 'https://www.youtube.com/embed/1FZ0A1QCMWc', order: 1 },
  { unit: 3, lesson: 1, title: 'But What Is a Neural Network? | 3Blue1Brown', url: 'https://www.youtube.com/embed/aircAruvnKk', order: 1 },
  { unit: 3, lesson: 2, title: 'But What Is a Neural Network? | 3Blue1Brown', url: 'https://www.youtube.com/embed/aircAruvnKk', order: 1 },
  { unit: 3, lesson: 3, title: 'But What Is a Neural Network? | 3Blue1Brown', url: 'https://www.youtube.com/embed/aircAruvnKk', order: 1 },
  { unit: 3, lesson: 4, title: 'But What Is a Neural Network? | 3Blue1Brown', url: 'https://www.youtube.com/embed/aircAruvnKk', order: 1 },
  { unit: 4, lesson: 1, title: 'Natural Language Processing In 5 Minutes | Simplilearn', url: 'https://www.youtube.com/embed/CMrHM8a3hqw', order: 1 },
  { unit: 4, lesson: 2, title: 'Natural Language Processing In 5 Minutes | Simplilearn', url: 'https://www.youtube.com/embed/CMrHM8a3hqw', order: 1 },
  { unit: 4, lesson: 3, title: 'What are Large Language Models (LLMs)?', url: 'https://www.youtube.com/embed/iR2O2GPbB0E', order: 1 },
  { unit: 4, lesson: 4, title: 'What are Large Language Models (LLMs)?', url: 'https://www.youtube.com/embed/iR2O2GPbB0E', order: 1 },
  { unit: 5, lesson: 1, title: 'Computer Vision Explained | Simplilearn', url: 'https://www.youtube.com/embed/puB-4LuRNys', order: 1 },
  { unit: 5, lesson: 2, title: 'Computer Vision Explained | Simplilearn', url: 'https://www.youtube.com/embed/puB-4LuRNys', order: 1 },
  { unit: 5, lesson: 3, title: 'Computer Vision Explained | Simplilearn', url: 'https://www.youtube.com/embed/puB-4LuRNys', order: 1 },
  { unit: 5, lesson: 4, title: 'Computer Vision Explained | Simplilearn', url: 'https://www.youtube.com/embed/puB-4LuRNys', order: 1 },
  { unit: 6, lesson: 1, title: 'Ethics & AI: Equal Access and Algorithmic Bias', url: 'https://www.youtube.com/embed/tJQSyzBUAew', order: 1 },
  { unit: 6, lesson: 2, title: 'What is Responsible AI? | AI Ethics Explained', url: 'https://www.youtube.com/embed/6gLiOfP-C5k', order: 1 },
  { unit: 6, lesson: 3, title: 'Ethics & AI: Equal Access and Algorithmic Bias', url: 'https://www.youtube.com/embed/tJQSyzBUAew', order: 1 },
  { unit: 6, lesson: 4, title: 'What is Responsible AI? | AI Ethics Explained', url: 'https://www.youtube.com/embed/6gLiOfP-C5k', order: 1 },
  { unit: 7, lesson: 1, title: 'Learn Prompt Engineering: Full Beginner Crash Course', url: 'https://www.youtube.com/embed/LWiMwhDZ9as', order: 1 },
  { unit: 7, lesson: 2, title: 'Learn Prompt Engineering: Full Beginner Crash Course', url: 'https://www.youtube.com/embed/LWiMwhDZ9as', order: 1 },
  { unit: 7, lesson: 3, title: 'Learn Prompt Engineering: Full Beginner Crash Course', url: 'https://www.youtube.com/embed/LWiMwhDZ9as', order: 1 },
  { unit: 8, lesson: 1, title: 'How to Use AI APIs: A Beginner Guide', url: 'https://www.youtube.com/embed/kANs1GDjheI', order: 1 },
  { unit: 8, lesson: 2, title: 'How to Use AI APIs: A Beginner Guide', url: 'https://www.youtube.com/embed/kANs1GDjheI', order: 1 },
  { unit: 8, lesson: 3, title: 'How to Use AI APIs: A Beginner Guide', url: 'https://www.youtube.com/embed/kANs1GDjheI', order: 1 },
  { unit: 9, lesson: 1, title: 'But What Is a Neural Network? | 3Blue1Brown', url: 'https://www.youtube.com/embed/aircAruvnKk', order: 1 },
  { unit: 9, lesson: 2, title: 'Convolutional Neural Network Explained | CNN Deep Learning Tutorial', url: 'https://www.youtube.com/embed/umQKXMUCqQU', order: 1 },
  { unit: 9, lesson: 3, title: 'Introduction to Generative AI', url: 'https://www.youtube.com/embed/G2fqAlgmoPo', order: 1 },
  { unit: 10, lesson: 1, title: 'Supervised vs Unsupervised vs Reinforcement Learning | Simplilearn', url: 'https://www.youtube.com/embed/1FZ0A1QCMWc', order: 1 },
  { unit: 10, lesson: 2, title: 'Supervised vs Unsupervised vs Reinforcement Learning | Simplilearn', url: 'https://www.youtube.com/embed/1FZ0A1QCMWc', order: 1 },
  { unit: 10, lesson: 3, title: 'Supervised vs Unsupervised vs Reinforcement Learning | Simplilearn', url: 'https://www.youtube.com/embed/1FZ0A1QCMWc', order: 1 },
  { unit: 11, lesson: 1, title: 'AI in Medical Imaging Explained | Healthcare AI', url: 'https://www.youtube.com/embed/2E_tSesgE5U', order: 1 },
  { unit: 11, lesson: 2, title: 'AI in Medical Imaging Explained | Healthcare AI', url: 'https://www.youtube.com/embed/2E_tSesgE5U', order: 1 },
  { unit: 11, lesson: 3, title: 'AI in Medical Imaging Explained | Healthcare AI', url: 'https://www.youtube.com/embed/2E_tSesgE5U', order: 1 },
  { unit: 12, lesson: 1, title: 'How to Use AI APIs: A Beginner Guide', url: 'https://www.youtube.com/embed/kANs1GDjheI', order: 1 },
  { unit: 12, lesson: 2, title: 'Supervised vs Unsupervised vs Reinforcement Learning | Simplilearn', url: 'https://www.youtube.com/embed/1FZ0A1QCMWc', order: 1 },
  { unit: 12, lesson: 3, title: 'Supervised vs Unsupervised vs Reinforcement Learning | Simplilearn', url: 'https://www.youtube.com/embed/1FZ0A1QCMWc', order: 1 },
  { unit: 13, lesson: 1, title: 'Introduction to Generative AI', url: 'https://www.youtube.com/embed/G2fqAlgmoPo', order: 1 },
  { unit: 13, lesson: 2, title: 'What are Large Language Models (LLMs)?', url: 'https://www.youtube.com/embed/iR2O2GPbB0E', order: 1 },
  { unit: 13, lesson: 3, title: 'Introduction to Generative AI', url: 'https://www.youtube.com/embed/G2fqAlgmoPo', order: 1 },
  { unit: 13, lesson: 4, title: 'Introduction to Generative AI', url: 'https://www.youtube.com/embed/G2fqAlgmoPo', order: 1 },
  { unit: 14, lesson: 1, title: 'Ethics & AI: Equal Access and Algorithmic Bias', url: 'https://www.youtube.com/embed/tJQSyzBUAew', order: 1 },
  { unit: 14, lesson: 2, title: 'What is Responsible AI? | AI Ethics Explained', url: 'https://www.youtube.com/embed/6gLiOfP-C5k', order: 1 },
  { unit: 14, lesson: 3, title: 'Introduction to Generative AI', url: 'https://www.youtube.com/embed/G2fqAlgmoPo', order: 1 },
  { unit: 15, lesson: 1, title: 'What Is AI? | Applications in Daily Life', url: 'https://www.youtube.com/embed/ad79nYk2keg', order: 1 },
  { unit: 15, lesson: 2, title: 'What is AI? In 5 Minutes', url: 'https://www.youtube.com/embed/2ePf9rue1Ao', order: 1 },
  { unit: 15, lesson: 3, title: 'Introduction to Generative AI', url: 'https://www.youtube.com/embed/G2fqAlgmoPo', order: 1 },
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

    for (const [unitIdx, lessons] of Object.entries(lessonData)) {
      const unitId = parseInt(unitIdx);
      for (const [lessonIdx, lesson] of lessons.entries()) {
        const result = insertLesson.run(unitId, lesson.title, lessonIdx + 1);
        const lessonId = result.lastInsertRowid;
        for (const [exIdx, ex] of lesson.content.entries()) {
          insertExercise.run(lessonId, ex.type, ex.question, ex.options, ex.answer, ex.explanation, exIdx + 1);
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

    let totalEx = 0;
    for (const lessons of Object.values(lessonData)) {
      for (const lesson of lessons) totalEx += lesson.content.length;
    }
    console.log(`Seeded: ${units.length} units, ${Object.values(lessonData).flat().length} lessons, ${totalEx} exercises`);
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