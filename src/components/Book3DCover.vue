<template>
  <div 
    class="book-container"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    ref="bookRef"
  >
    <div 
      class="book-3d"
      :style="bookStyle"
    >
      <!-- غلاف الكتاب الأمامي -->
      <div class="cover front">
        <img :src="coverUrl" :alt="title" />
        <!-- طبقة لمعان ضوئية للتأثير 3D -->
        <div class="glare" :style="glareStyle"></div>
      </div>

      <!-- كعب الكتاب (الجانب) -->
      <div class="spine">
        <span class="spine-title">{{ title }}</span>
      </div>

      <!-- الجانب الخلفي -->
      <div class="cover back"></div>

      <!-- صفحات الكتاب الخشبية/الورقية من الجنب -->
      <div class="pages-side"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  coverUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
});

const bookRef = ref(null);
const rotateX = ref(0);
const rotateY = ref(-20); // زاوية ميل مسبقة عشان يبان مجسم من البداية
const glareOpacity = ref(0);
const glarePos = ref({ x: 50, y: 50 });

// حساب حركات الماوس وتحويلها لزوايا تدوير
const handleMouseMove = (e) => {
  if (!bookRef.value) return;
  
  const rect = bookRef.value.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  // موقع الماوس بالنسبة لمنتصف الكتاب (-0.5 إلى 0.5)
  const mouseX = (e.clientX - rect.left) / width - 0.5;
  const mouseY = (e.clientY - rect.top) / height - 0.5;

  // إعطاء زاوية ميل بحد أقصى 25 درجة
  rotateY.value = mouseX * 45;
  rotateX.value = -mouseY * 45;

  // حساب حركة الإضاءة (Glare)
  glareOpacity.value = 0.3;
  glarePos.value = {
    x: ((e.clientX - rect.left) / width) * 100,
    y: ((e.clientY - rect.top) / height) * 100
  };
};

// إعادة الكتاب للوضع الطبيعي لما الماوس يخرج
const handleMouseLeave = () => {
  rotateX.value = 0;
  rotateY.value = -20; // يرجع لميل 3D خفيف ورائع
  glareOpacity.value = 0;
};

// Dynamic Styles للـ Book 3D
const bookStyle = computed(() => ({
  transform: `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`
}));

// Dynamic Styles لطبقة اللمعان
const glareStyle = computed(() => ({
  opacity: glareOpacity.value,
  background: `radial-gradient(circle at ${glarePos.value.x}% ${glarePos.value.y}%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 80%)`
}));
</script>

<style scoped>
.book-container {
  perspective: 1200px; /* يعطي العمق 3D */
  width: 220px;
  height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 20px auto;
}

.book-3d {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.15s ease-out;
  border-radius: 4px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.25);
}

/* الغلاف الأمامي */
.cover.front {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
  backface-visibility: hidden;
  transform: translateZ(15px); /* بروزه للأمام لإعطاء سُمك */
}

.cover.front img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* طبقة لمعان الماوس */
.glare {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* كعب الكتاب (الجانب الأيسر) */
.spine {
  position: absolute;
  width: 30px; /* سُمك الكتاب */
  height: 100%;
  left: -15px;
  top: 0;
  background: #222;
  color: #fff;
  transform: rotateY(-90deg) translateZ(0px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px 0 0 2px;
  overflow: hidden;
}

.spine-title {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 1px;
  color: #ddd;
  white-space: nowrap;
}

/* صفحات الكتاب من الجنب الأيمن */
.pages-side {
  position: absolute;
  width: 30px;
  height: 96%;
  right: -15px;
  top: 2%;
  background: linear-gradient(90deg, #e0e0e0 0%, #ffffff 50%, #d5d5d5 100%);
  transform: rotateY(90deg) translateZ(205px);
  border-radius: 0 2px 2px 0;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
}

/* الغلاف الخلفي */
.cover.back {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #333;
  transform: translateZ(-15px) rotateY(180deg);
  border-radius: 4px;
}
</style>