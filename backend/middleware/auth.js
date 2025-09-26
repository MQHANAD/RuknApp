const { createClient } = require('@supabase/supabase-js');

// إعداد Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY environment variables are required');
}
const supabase = createClient(supabaseUrl, supabaseKey);

// التحقق من المصادقة
exports.checkAuth = async (req, res, next) => {
  try {
    // الحصول على توكن المصادقة من الهيدر
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح لك بالوصول - توكن غير موجود'
      });
    }

    // التحقق من صحة التوكن والحصول على المستخدم
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح لك بالوصول - جلسة غير صالحة'
      });
    }

    // تخزين بيانات المستخدم في الطلب لاستخدامها في نقاط النهاية المهمة
    req.user = data.user;
    next();

  } catch (error) {
    console.error('Error in auth middleware:', error.message);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء التحقق من المصادقة'
    });
  }
};

// التحقق من الجلسة (session check) للطرق التي لا تتطلب مصادقة كاملة
exports.checkSession = async (req, res, next) => {
  try {
    // الحصول على توكن المصادقة من الهيدر
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error) {
        req.user = data.user;
      }
    }
    
    next();
  } catch (error) {
    console.error('Error in session check middleware:', error.message);
    next();
  }
};
