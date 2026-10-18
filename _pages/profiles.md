---
layout: page
permalink: /people/
title: people
title_zh: 成员
description: members of the lab or group
description_zh: 实验室或课题组成员
nav: true
nav_order: 1

# ── 第一部分：全体大合影 ──────────────────────────────────────────
# 把合影图片放入 /assets/img/，然后修改下面 image 值即可
group_photo:
  image: 8.jpg
  caption: IVC Lab 全体成员合影

# ── 第二部分：导师简介 ─────────────────────────────────────────────
# 头像放在 /assets/img/ 下
mentor:
  image: teacher.jpg
  name: 冯欣
  name_en: Xin Feng
  link: http://zs.yjs.cqut.edu.cn/info/1081/3188.htm
  title: 博士 · 硕士生导师
  title_en: Ph.D. · MSc Supervisor
  bio: 研究方向：计算机视觉、图像及视频处理
  bio_en: "Research: Computer Vision, Image & Video Processing"
  intro: |
    冯欣，博士，硕士生导师，重庆市学术技术带头人后备人选；美国纽约大学工程学院电子工程系博士后。
    致力于无人系统智能视觉感知、神经网络模型对抗攻击、医学图像处理及辅助诊疗等研究。
    在 TPAMI、CVPR、NeurIPS、ICCV 等顶级期刊/会议上发表论文 40 余篇，授权专利 14 件；
    主持国家自然科学基金青年基金、重庆市自然科学基金等多项省部级项目 16 项，承担经费 300 余万元。
    相关成果已在长安汽车、上海华域视觉科技等企业完成产业化应用，产生经济效益 1000 万元以上。
    获重庆理工大学首批"青年英才"及"士继英才·领军人才"称号。
  intro_en: |
    I am a Ph.D. holder and MSc supervisor, recognized as a key academic talent in Chongqing. Before that, I completed my postdoctoral research at the NYU Tandon School of Engineering.
    My work centers on intelligent visual perception for unmanned systems, adversarial attacks on neural networks, and medical image processing. Over the years, I have published more than 40 papers in top venues such as TPAMI, CVPR, NeurIPS, and ICCV, and hold 14 patents.
    I have led 16+ provincial and ministerial-level projects, including NSFC grants, with total funding exceeding 3 million RMB. Several of my results have been put into production at Changan Auto and Shanghai Huayu Vision, generating economic benefits of over 10 million RMB.
    I was also awarded the "Young Elite" and "Lingjun Talent" titles by Chongqing University of Technology.

# ── 第三部分：学生 / 博后 网格 ───────────────────────────────────
# 数据从 _data/students.yml 读取，增删学生只需编辑那个文件
---

<style>
/* ── 通用 ──────────────────────────────────────── */
.people-section-title {
  margin: 2.5rem 0 1rem;
  font-size: 1.4rem;
}

/* ── 第一部分：合影 ───────────────────────────── */
.group-photo {
  margin: 0 0 2.5rem;
}
.group-photo img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 0.5rem;
  display: block;
}
.group-photo figcaption {
  text-align: center;
  font-size: 0.9rem;
  color: var(--global-text-color-light);
  margin-top: 0.4rem;
}

/* ── 第二部分：导师简介（左图右文）────────────── */
.mentor-section {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 1.5rem;
  align-items: start;
  margin-bottom: 0.5rem;
}
@media (max-width: 768px) {
  .mentor-section {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
.mentor-photo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;
  padding-top: 1.5rem;
}
@media (max-width: 768px) {
  .mentor-photo { padding-top: 0; }
}
.mentor-photo img {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 0.5rem;
}
.mentor-photo .member-name  { font-size: 1.15rem; font-weight: 700; }
.mentor-photo a.member-link { text-decoration: none; display: flex; flex-direction: column; align-items: flex-start; gap: 0.8rem; }
.mentor-photo a.member-link img { width: 180px; height: 180px; object-fit: cover; border-radius: 0.5rem; }
.mentor-photo a.member-link .member-name:hover { text-decoration: underline; text-underline-offset: 2px; }
.mentor-photo .member-title { font-size: 0.95rem;  color: var(--global-text-color-light); }
.mentor-photo .member-bio   { font-size: 0.85rem;  color: var(--global-text-color-light); }
.mentor-intro {
  font-size: 0.95rem;
  line-height: 1.7;
  margin-top: -1rem;
}
/* main.css sets `div { color: var(--global-text-color) }` which overrides
   the container color on inner divs. Target the direct children explicitly. */
.mentor-intro > div[data-lang] { color: var(--global-text-color-light) !important; }

/* ── 第三部分：学生小网格（4 列） ─────────────── */
.students-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
@media (max-width: 768px) {
  .students-grid { grid-template-columns: repeat(2, 1fr); }
}
.student-card {
  text-align: center;
}
.student-card img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin: 0 auto 0.5rem;
  display: block;
}
.student-card .student-name { font-weight: 600; font-size: 1rem; }
.student-card .student-role { font-size: 0.85rem; color: #495057; margin-top: 0.15rem; }
html[data-theme="dark"] .student-card .student-role { color: #adb5bd; }
/* Card with a link: whole card is clickable */
.student-card a.student-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
.student-card a.student-card-link .student-name:hover {
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>

<!-- ═══════ 第一部分：全体大合影 ═══════ -->
<figure class="group-photo">
  <img
    src="{{ site.baseurl }}/assets/img/{{ page.group_photo.image }}"
    alt="{{ page.group_photo.caption }}"
    loading="lazy"
  />
  <figcaption>{{ page.group_photo.caption }}</figcaption>
</figure>

<!-- ═══════ 第二部分：导师简介 ═══════ -->
<div data-lang="en"><h2 class="people-section-title">Lab Director</h2></div>
<div data-lang="zh"><h2 class="people-section-title">导师 / 课题组长</h2></div>

<div class="mentor-section">
  <div class="mentor-photo">
  <a class="member-link" href="{{ page.mentor.link }}" target="_blank" rel="noopener">
    <img src="{{ site.baseurl }}/assets/img/{{ page.mentor.image }}" alt="{{ page.mentor.name_en }}" loading="lazy" />
    <div data-lang="en">
      <div class="member-name">{{ page.mentor.name_en }}</div>
      <div class="member-title">{{ page.mentor.title_en }}</div>
      <div class="member-bio">{{ page.mentor.bio_en }}</div>
    </div>
    <div data-lang="zh">
      <div class="member-name">{{ page.mentor.name }}</div>
      <div class="member-title">{{ page.mentor.title }}</div>
      <div class="member-bio">{{ page.mentor.bio }}</div>
    </div>
  </a>
  </div>
  <div class="mentor-intro">
    <div data-lang="en">{{ page.mentor.intro_en }}</div>
    <div data-lang="zh">{{ page.mentor.intro }}</div>
  </div>
</div>

<!-- ═══════ 第三部分：学生 / 博后 ═══════ -->
<div data-lang="en"><h2 class="people-section-title">Master Students</h2></div>
<div data-lang="zh"><h2 class="people-section-title">硕士研究生</h2></div>

<div class="students-grid">
  {% for s in site.data.students.students %}
  <div class="student-card">
    {% if s.link %}
    <a class="student-card-link" href="{{ s.link }}" target="_blank" rel="noopener">
      <img src="{{ site.baseurl }}/assets/img/{{ s.image }}" alt="{{ s.name_en }}" loading="lazy" />
      <div data-lang="en">
        <div class="student-name">{{ s.name_en }}</div>
        <div class="student-role">{{ s.role_en }} · {{ s.year }}</div>
      </div>
      <div data-lang="zh">
        <div class="student-name">{{ s.name }}</div>
        <div class="student-role">{{ s.role }} · {{ s.year }}</div>
      </div>
    </a>
    {% else %}
    <img src="{{ site.baseurl }}/assets/img/{{ s.image }}" alt="{{ s.name_en }}" loading="lazy" />
    <div data-lang="en">
      <div class="student-name">{{ s.name_en }}</div>
      <div class="student-role">{{ s.role_en }} · {{ s.year }}</div>
    </div>
    <div data-lang="zh">
      <div class="student-name">{{ s.name }}</div>
      <div class="student-role">{{ s.role }} · {{ s.year }}</div>
    </div>
    {% endif %}
  </div>
  {% endfor %}
</div>

<!-- ═══════ 第四部分：已毕业硕士生 ═══════ -->
<div data-lang="en"><h2 class="people-section-title">Graduated Master Students</h2></div>
<div data-lang="zh"><h2 class="people-section-title">已毕业硕士生</h2></div>

<div class="students-grid">
  {% for s in site.data.students.graduated_students %}
  <div class="student-card">
    {% if s.link %}
    <a class="student-card-link" href="{{ s.link }}" target="_blank" rel="noopener">
      <img src="{{ site.baseurl }}/assets/img/{{ s.image }}" alt="{{ s.name_en }}" loading="lazy" />
      <div data-lang="en">
        <div class="student-name">{{ s.name_en }}</div>
        <div class="student-role">{{ s.role_en }} · {{ s.year }}</div>
      </div>
      <div data-lang="zh">
        <div class="student-name">{{ s.name }}</div>
        <div class="student-role">{{ s.role }} · {{ s.year }}</div>
      </div>
    </a>
    {% else %}
    <img src="{{ site.baseurl }}/assets/img/{{ s.image }}" alt="{{ s.name_en }}" loading="lazy" />
    <div data-lang="en">
      <div class="student-name">{{ s.name_en }}</div>
      <div class="student-role">{{ s.role_en }} · {{ s.year }}</div>
    </div>
    <div data-lang="zh">
      <div class="student-name">{{ s.name }}</div>
      <div class="student-role">{{ s.role }} · {{ s.year }}</div>
    </div>
    {% endif %}
  </div>
  {% endfor %}
</div>
