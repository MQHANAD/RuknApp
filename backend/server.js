const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// تحميل المتغيرات البيئية
dotenv.config();

// إعداد Express
const app = express();
app.use(cors());
app.use(express.json());

// إعداد Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY environment variables are required');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// استيراد ميدلوير المصادقة
const { checkAuth, checkSession } = require('./middleware/auth');

// نقاط نهاية API
app.get('/', (req, res) => {
  res.json({ message: 'مرحبًا بك في خادم RuknApp!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// استيراد مسارات API
const recommendationsRoutes = require('./routes/recommendations');
const authRoutes = require('./routes/auth');

// استخدام مسارات API
app.use('/api', recommendationsRoutes);
app.use('/auth', authRoutes);

// مثال على استخدام حماية المسارات بواسطة ميدلوير المصادقة
// app.use('/api/protected', checkAuth, protectedRoutes);

// بدء الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
