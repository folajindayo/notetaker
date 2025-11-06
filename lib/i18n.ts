// Multi-language support for NoteBoard

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ko' | 'pt' | 'ar' | 'hi';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    explore: string;
    communities: string;
    trending: string;
    leaderboard: string;
    rewards: string;
    bookmarks: string;
    profile: string;
    settings: string;
    notifications: string;
    search: string;
  };

  // Actions
  actions: {
    post: string;
    reply: string;
    like: string;
    repost: string;
    bookmark: string;
    share: string;
    edit: string;
    delete: string;
    report: string;
    follow: string;
    unfollow: string;
    tip: string;
    subscribe: string;
    cancel: string;
    save: string;
    submit: string;
    close: string;
    confirm: string;
  };

  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    noData: string;
    tryAgain: string;
    learnMore: string;
    viewMore: string;
    showLess: string;
  };

  // Post/Note
  note: {
    whatsHappening: string;
    postNote: string;
    charactersRemaining: string;
    addTags: string;
    addMedia: string;
    createPoll: string;
    scheduledPost: string;
    draft: string;
    published: string;
  };

  // Profile
  profile: {
    followers: string;
    following: string;
    notes: string;
    joined: string;
    editProfile: string;
    username: string;
    bio: string;
    website: string;
    location: string;
    badges: string;
    statistics: string;
    activity: string;
  };

  // Community
  community: {
    create: string;
    join: string;
    leave: string;
    members: string;
    public: string;
    private: string;
    description: string;
    rules: string;
    moderators: string;
  };

  // Rewards
  rewards: {
    points: string;
    earnings: string;
    claim: string;
    history: string;
    rank: string;
    streak: string;
    achievements: string;
    totalEarned: string;
  };

  // Settings
  settings: {
    account: string;
    privacy: string;
    notifications: string;
    appearance: string;
    language: string;
    theme: string;
    security: string;
    wallet: string;
    premium: string;
  };

  // Time
  time: {
    now: string;
    minuteAgo: string;
    minutesAgo: string;
    hourAgo: string;
    hoursAgo: string;
    dayAgo: string;
    daysAgo: string;
    weekAgo: string;
    weeksAgo: string;
    monthAgo: string;
    monthsAgo: string;
    yearAgo: string;
    yearsAgo: string;
  };

  // Messages
  messages: {
    connectWallet: string;
    transactionPending: string;
    transactionSuccess: string;
    transactionFailed: string;
    insufficientBalance: string;
    networkError: string;
    postSuccess: string;
    postFailed: string;
    followSuccess: string;
    unfollowSuccess: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      explore: 'Explore',
      communities: 'Communities',
      trending: 'Trending',
      leaderboard: 'Leaderboard',
      rewards: 'Rewards',
      bookmarks: 'Bookmarks',
      profile: 'Profile',
      settings: 'Settings',
      notifications: 'Notifications',
      search: 'Search',
    },
    actions: {
      post: 'Post',
      reply: 'Reply',
      like: 'Like',
      repost: 'Repost',
      bookmark: 'Bookmark',
      share: 'Share',
      edit: 'Edit',
      delete: 'Delete',
      report: 'Report',
      follow: 'Follow',
      unfollow: 'Unfollow',
      tip: 'Tip',
      subscribe: 'Subscribe',
      cancel: 'Cancel',
      save: 'Save',
      submit: 'Submit',
      close: 'Close',
      confirm: 'Confirm',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      noData: 'No data available',
      tryAgain: 'Try again',
      learnMore: 'Learn more',
      viewMore: 'View more',
      showLess: 'Show less',
    },
    note: {
      whatsHappening: "What's happening?",
      postNote: 'Post Note',
      charactersRemaining: 'characters remaining',
      addTags: 'Add tags',
      addMedia: 'Add media',
      createPoll: 'Create poll',
      scheduledPost: 'Scheduled post',
      draft: 'Draft',
      published: 'Published',
    },
    profile: {
      followers: 'Followers',
      following: 'Following',
      notes: 'Notes',
      joined: 'Joined',
      editProfile: 'Edit Profile',
      username: 'Username',
      bio: 'Bio',
      website: 'Website',
      location: 'Location',
      badges: 'Badges',
      statistics: 'Statistics',
      activity: 'Activity',
    },
    community: {
      create: 'Create Community',
      join: 'Join',
      leave: 'Leave',
      members: 'Members',
      public: 'Public',
      private: 'Private',
      description: 'Description',
      rules: 'Rules',
      moderators: 'Moderators',
    },
    rewards: {
      points: 'Points',
      earnings: 'Earnings',
      claim: 'Claim',
      history: 'History',
      rank: 'Rank',
      streak: 'Streak',
      achievements: 'Achievements',
      totalEarned: 'Total Earned',
    },
    settings: {
      account: 'Account',
      privacy: 'Privacy',
      notifications: 'Notifications',
      appearance: 'Appearance',
      language: 'Language',
      theme: 'Theme',
      security: 'Security',
      wallet: 'Wallet',
      premium: 'Premium',
    },
    time: {
      now: 'now',
      minuteAgo: '1 minute ago',
      minutesAgo: 'minutes ago',
      hourAgo: '1 hour ago',
      hoursAgo: 'hours ago',
      dayAgo: '1 day ago',
      daysAgo: 'days ago',
      weekAgo: '1 week ago',
      weeksAgo: 'weeks ago',
      monthAgo: '1 month ago',
      monthsAgo: 'months ago',
      yearAgo: '1 year ago',
      yearsAgo: 'years ago',
    },
    messages: {
      connectWallet: 'Please connect your wallet',
      transactionPending: 'Transaction pending...',
      transactionSuccess: 'Transaction successful!',
      transactionFailed: 'Transaction failed',
      insufficientBalance: 'Insufficient balance',
      networkError: 'Network error',
      postSuccess: 'Note posted successfully!',
      postFailed: 'Failed to post note',
      followSuccess: 'Successfully followed user',
      unfollowSuccess: 'Successfully unfollowed user',
    },
  },

  es: {
    nav: {
      home: 'Inicio',
      explore: 'Explorar',
      communities: 'Comunidades',
      trending: 'Tendencias',
      leaderboard: 'Clasificación',
      rewards: 'Recompensas',
      bookmarks: 'Marcadores',
      profile: 'Perfil',
      settings: 'Configuración',
      notifications: 'Notificaciones',
      search: 'Buscar',
    },
    actions: {
      post: 'Publicar',
      reply: 'Responder',
      like: 'Me gusta',
      repost: 'Republicar',
      bookmark: 'Guardar',
      share: 'Compartir',
      edit: 'Editar',
      delete: 'Eliminar',
      report: 'Reportar',
      follow: 'Seguir',
      unfollow: 'Dejar de seguir',
      tip: 'Propina',
      subscribe: 'Suscribirse',
      cancel: 'Cancelar',
      save: 'Guardar',
      submit: 'Enviar',
      close: 'Cerrar',
      confirm: 'Confirmar',
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      warning: 'Advertencia',
      info: 'Información',
      noData: 'No hay datos disponibles',
      tryAgain: 'Intentar de nuevo',
      learnMore: 'Aprende más',
      viewMore: 'Ver más',
      showLess: 'Mostrar menos',
    },
    note: {
      whatsHappening: '¿Qué está pasando?',
      postNote: 'Publicar nota',
      charactersRemaining: 'caracteres restantes',
      addTags: 'Agregar etiquetas',
      addMedia: 'Agregar medios',
      createPoll: 'Crear encuesta',
      scheduledPost: 'Publicación programada',
      draft: 'Borrador',
      published: 'Publicado',
    },
    profile: {
      followers: 'Seguidores',
      following: 'Siguiendo',
      notes: 'Notas',
      joined: 'Se unió',
      editProfile: 'Editar perfil',
      username: 'Nombre de usuario',
      bio: 'Biografía',
      website: 'Sitio web',
      location: 'Ubicación',
      badges: 'Insignias',
      statistics: 'Estadísticas',
      activity: 'Actividad',
    },
    community: {
      create: 'Crear comunidad',
      join: 'Unirse',
      leave: 'Salir',
      members: 'Miembros',
      public: 'Público',
      private: 'Privado',
      description: 'Descripción',
      rules: 'Reglas',
      moderators: 'Moderadores',
    },
    rewards: {
      points: 'Puntos',
      earnings: 'Ganancias',
      claim: 'Reclamar',
      history: 'Historial',
      rank: 'Rango',
      streak: 'Racha',
      achievements: 'Logros',
      totalEarned: 'Total ganado',
    },
    settings: {
      account: 'Cuenta',
      privacy: 'Privacidad',
      notifications: 'Notificaciones',
      appearance: 'Apariencia',
      language: 'Idioma',
      theme: 'Tema',
      security: 'Seguridad',
      wallet: 'Cartera',
      premium: 'Premium',
    },
    time: {
      now: 'ahora',
      minuteAgo: 'hace 1 minuto',
      minutesAgo: 'minutos atrás',
      hourAgo: 'hace 1 hora',
      hoursAgo: 'horas atrás',
      dayAgo: 'hace 1 día',
      daysAgo: 'días atrás',
      weekAgo: 'hace 1 semana',
      weeksAgo: 'semanas atrás',
      monthAgo: 'hace 1 mes',
      monthsAgo: 'meses atrás',
      yearAgo: 'hace 1 año',
      yearsAgo: 'años atrás',
    },
    messages: {
      connectWallet: 'Por favor conecta tu cartera',
      transactionPending: 'Transacción pendiente...',
      transactionSuccess: '¡Transacción exitosa!',
      transactionFailed: 'Transacción fallida',
      insufficientBalance: 'Saldo insuficiente',
      networkError: 'Error de red',
      postSuccess: '¡Nota publicada con éxito!',
      postFailed: 'Error al publicar nota',
      followSuccess: 'Usuario seguido con éxito',
      unfollowSuccess: 'Dejaste de seguir al usuario',
    },
  },

  fr: {
    nav: {
      home: 'Accueil',
      explore: 'Explorer',
      communities: 'Communautés',
      trending: 'Tendances',
      leaderboard: 'Classement',
      rewards: 'Récompenses',
      bookmarks: 'Favoris',
      profile: 'Profil',
      settings: 'Paramètres',
      notifications: 'Notifications',
      search: 'Rechercher',
    },
    actions: {
      post: 'Publier',
      reply: 'Répondre',
      like: "J'aime",
      repost: 'Republier',
      bookmark: 'Enregistrer',
      share: 'Partager',
      edit: 'Modifier',
      delete: 'Supprimer',
      report: 'Signaler',
      follow: 'Suivre',
      unfollow: 'Ne plus suivre',
      tip: 'Pourboire',
      subscribe: "S'abonner",
      cancel: 'Annuler',
      save: 'Enregistrer',
      submit: 'Soumettre',
      close: 'Fermer',
      confirm: 'Confirmer',
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      warning: 'Avertissement',
      info: 'Information',
      noData: 'Aucune donnée disponible',
      tryAgain: 'Réessayer',
      learnMore: 'En savoir plus',
      viewMore: 'Voir plus',
      showLess: 'Voir moins',
    },
    note: {
      whatsHappening: 'Quoi de neuf?',
      postNote: 'Publier une note',
      charactersRemaining: 'caractères restants',
      addTags: 'Ajouter des tags',
      addMedia: 'Ajouter des médias',
      createPoll: 'Créer un sondage',
      scheduledPost: 'Publication programmée',
      draft: 'Brouillon',
      published: 'Publié',
    },
    profile: {
      followers: 'Abonnés',
      following: 'Abonnements',
      notes: 'Notes',
      joined: 'Inscrit',
      editProfile: 'Modifier le profil',
      username: "Nom d'utilisateur",
      bio: 'Biographie',
      website: 'Site web',
      location: 'Localisation',
      badges: 'Badges',
      statistics: 'Statistiques',
      activity: 'Activité',
    },
    community: {
      create: 'Créer une communauté',
      join: 'Rejoindre',
      leave: 'Quitter',
      members: 'Membres',
      public: 'Public',
      private: 'Privé',
      description: 'Description',
      rules: 'Règles',
      moderators: 'Modérateurs',
    },
    rewards: {
      points: 'Points',
      earnings: 'Gains',
      claim: 'Réclamer',
      history: 'Historique',
      rank: 'Rang',
      streak: 'Série',
      achievements: 'Réalisations',
      totalEarned: 'Total gagné',
    },
    settings: {
      account: 'Compte',
      privacy: 'Confidentialité',
      notifications: 'Notifications',
      appearance: 'Apparence',
      language: 'Langue',
      theme: 'Thème',
      security: 'Sécurité',
      wallet: 'Portefeuille',
      premium: 'Premium',
    },
    time: {
      now: 'maintenant',
      minuteAgo: 'il y a 1 minute',
      minutesAgo: 'il y a quelques minutes',
      hourAgo: 'il y a 1 heure',
      hoursAgo: 'il y a quelques heures',
      dayAgo: 'il y a 1 jour',
      daysAgo: 'il y a quelques jours',
      weekAgo: 'il y a 1 semaine',
      weeksAgo: 'il y a quelques semaines',
      monthAgo: 'il y a 1 mois',
      monthsAgo: 'il y a quelques mois',
      yearAgo: 'il y a 1 an',
      yearsAgo: 'il y a quelques années',
    },
    messages: {
      connectWallet: 'Veuillez connecter votre portefeuille',
      transactionPending: 'Transaction en cours...',
      transactionSuccess: 'Transaction réussie!',
      transactionFailed: 'Transaction échouée',
      insufficientBalance: 'Solde insuffisant',
      networkError: 'Erreur réseau',
      postSuccess: 'Note publiée avec succès!',
      postFailed: 'Échec de la publication',
      followSuccess: 'Utilisateur suivi avec succès',
      unfollowSuccess: 'Utilisateur désuivi',
    },
  },

  de: {
    nav: {
      home: 'Startseite',
      explore: 'Entdecken',
      communities: 'Gemeinschaften',
      trending: 'Trends',
      leaderboard: 'Bestenliste',
      rewards: 'Belohnungen',
      bookmarks: 'Lesezeichen',
      profile: 'Profil',
      settings: 'Einstellungen',
      notifications: 'Benachrichtigungen',
      search: 'Suchen',
    },
    actions: {
      post: 'Posten',
      reply: 'Antworten',
      like: 'Gefällt mir',
      repost: 'Reposten',
      bookmark: 'Speichern',
      share: 'Teilen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      report: 'Melden',
      follow: 'Folgen',
      unfollow: 'Entfolgen',
      tip: 'Trinkgeld',
      subscribe: 'Abonnieren',
      cancel: 'Abbrechen',
      save: 'Speichern',
      submit: 'Absenden',
      close: 'Schließen',
      confirm: 'Bestätigen',
    },
    common: {
      loading: 'Lädt...',
      error: 'Fehler',
      success: 'Erfolg',
      warning: 'Warnung',
      info: 'Info',
      noData: 'Keine Daten verfügbar',
      tryAgain: 'Erneut versuchen',
      learnMore: 'Mehr erfahren',
      viewMore: 'Mehr anzeigen',
      showLess: 'Weniger anzeigen',
    },
    note: {
      whatsHappening: 'Was gibt es Neues?',
      postNote: 'Notiz posten',
      charactersRemaining: 'verbleibende Zeichen',
      addTags: 'Tags hinzufügen',
      addMedia: 'Medien hinzufügen',
      createPoll: 'Umfrage erstellen',
      scheduledPost: 'Geplanter Beitrag',
      draft: 'Entwurf',
      published: 'Veröffentlicht',
    },
    profile: {
      followers: 'Follower',
      following: 'Folge ich',
      notes: 'Notizen',
      joined: 'Beigetreten',
      editProfile: 'Profil bearbeiten',
      username: 'Benutzername',
      bio: 'Biografie',
      website: 'Webseite',
      location: 'Standort',
      badges: 'Abzeichen',
      statistics: 'Statistiken',
      activity: 'Aktivität',
    },
    community: {
      create: 'Gemeinschaft erstellen',
      join: 'Beitreten',
      leave: 'Verlassen',
      members: 'Mitglieder',
      public: 'Öffentlich',
      private: 'Privat',
      description: 'Beschreibung',
      rules: 'Regeln',
      moderators: 'Moderatoren',
    },
    rewards: {
      points: 'Punkte',
      earnings: 'Einnahmen',
      claim: 'Beanspruchen',
      history: 'Verlauf',
      rank: 'Rang',
      streak: 'Serie',
      achievements: 'Erfolge',
      totalEarned: 'Gesamt verdient',
    },
    settings: {
      account: 'Konto',
      privacy: 'Datenschutz',
      notifications: 'Benachrichtigungen',
      appearance: 'Erscheinungsbild',
      language: 'Sprache',
      theme: 'Design',
      security: 'Sicherheit',
      wallet: 'Geldbörse',
      premium: 'Premium',
    },
    time: {
      now: 'jetzt',
      minuteAgo: 'vor 1 Minute',
      minutesAgo: 'vor Minuten',
      hourAgo: 'vor 1 Stunde',
      hoursAgo: 'vor Stunden',
      dayAgo: 'vor 1 Tag',
      daysAgo: 'vor Tagen',
      weekAgo: 'vor 1 Woche',
      weeksAgo: 'vor Wochen',
      monthAgo: 'vor 1 Monat',
      monthsAgo: 'vor Monaten',
      yearAgo: 'vor 1 Jahr',
      yearsAgo: 'vor Jahren',
    },
    messages: {
      connectWallet: 'Bitte verbinden Sie Ihre Wallet',
      transactionPending: 'Transaktion ausstehend...',
      transactionSuccess: 'Transaktion erfolgreich!',
      transactionFailed: 'Transaktion fehlgeschlagen',
      insufficientBalance: 'Unzureichendes Guthaben',
      networkError: 'Netzwerkfehler',
      postSuccess: 'Notiz erfolgreich gepostet!',
      postFailed: 'Notiz konnte nicht gepostet werden',
      followSuccess: 'Benutzer erfolgreich gefolgt',
      unfollowSuccess: 'Benutzer entfolgt',
    },
  },

  zh: {
    nav: {
      home: '首页',
      explore: '探索',
      communities: '社区',
      trending: '热门',
      leaderboard: '排行榜',
      rewards: '奖励',
      bookmarks: '书签',
      profile: '个人资料',
      settings: '设置',
      notifications: '通知',
      search: '搜索',
    },
    actions: {
      post: '发布',
      reply: '回复',
      like: '点赞',
      repost: '转发',
      bookmark: '收藏',
      share: '分享',
      edit: '编辑',
      delete: '删除',
      report: '举报',
      follow: '关注',
      unfollow: '取消关注',
      tip: '打赏',
      subscribe: '订阅',
      cancel: '取消',
      save: '保存',
      submit: '提交',
      close: '关闭',
      confirm: '确认',
    },
    common: {
      loading: '加载中...',
      error: '错误',
      success: '成功',
      warning: '警告',
      info: '信息',
      noData: '暂无数据',
      tryAgain: '重试',
      learnMore: '了解更多',
      viewMore: '查看更多',
      showLess: '收起',
    },
    note: {
      whatsHappening: '有什么新鲜事？',
      postNote: '发布笔记',
      charactersRemaining: '剩余字符',
      addTags: '添加标签',
      addMedia: '添加媒体',
      createPoll: '创建投票',
      scheduledPost: '定时发布',
      draft: '草稿',
      published: '已发布',
    },
    profile: {
      followers: '粉丝',
      following: '关注',
      notes: '笔记',
      joined: '加入时间',
      editProfile: '编辑资料',
      username: '用户名',
      bio: '简介',
      website: '网站',
      location: '位置',
      badges: '徽章',
      statistics: '统计',
      activity: '活动',
    },
    community: {
      create: '创建社区',
      join: '加入',
      leave: '离开',
      members: '成员',
      public: '公开',
      private: '私密',
      description: '描述',
      rules: '规则',
      moderators: '版主',
    },
    rewards: {
      points: '积分',
      earnings: '收益',
      claim: '领取',
      history: '历史',
      rank: '排名',
      streak: '连续',
      achievements: '成就',
      totalEarned: '总收益',
    },
    settings: {
      account: '账户',
      privacy: '隐私',
      notifications: '通知',
      appearance: '外观',
      language: '语言',
      theme: '主题',
      security: '安全',
      wallet: '钱包',
      premium: '高级',
    },
    time: {
      now: '刚刚',
      minuteAgo: '1分钟前',
      minutesAgo: '分钟前',
      hourAgo: '1小时前',
      hoursAgo: '小时前',
      dayAgo: '1天前',
      daysAgo: '天前',
      weekAgo: '1周前',
      weeksAgo: '周前',
      monthAgo: '1个月前',
      monthsAgo: '个月前',
      yearAgo: '1年前',
      yearsAgo: '年前',
    },
    messages: {
      connectWallet: '请连接您的钱包',
      transactionPending: '交易进行中...',
      transactionSuccess: '交易成功！',
      transactionFailed: '交易失败',
      insufficientBalance: '余额不足',
      networkError: '网络错误',
      postSuccess: '笔记发布成功！',
      postFailed: '笔记发布失败',
      followSuccess: '关注成功',
      unfollowSuccess: '取消关注成功',
    },
  },

  ja: {
    nav: {
      home: 'ホーム',
      explore: '探索',
      communities: 'コミュニティ',
      trending: 'トレンド',
      leaderboard: 'リーダーボード',
      rewards: '報酬',
      bookmarks: 'ブックマーク',
      profile: 'プロフィール',
      settings: '設定',
      notifications: '通知',
      search: '検索',
    },
    actions: {
      post: '投稿',
      reply: '返信',
      like: 'いいね',
      repost: 'リポスト',
      bookmark: 'ブックマーク',
      share: '共有',
      edit: '編集',
      delete: '削除',
      report: '報告',
      follow: 'フォロー',
      unfollow: 'フォロー解除',
      tip: 'チップ',
      subscribe: '購読',
      cancel: 'キャンセル',
      save: '保存',
      submit: '送信',
      close: '閉じる',
      confirm: '確認',
    },
    common: {
      loading: '読み込み中...',
      error: 'エラー',
      success: '成功',
      warning: '警告',
      info: '情報',
      noData: 'データがありません',
      tryAgain: '再試行',
      learnMore: '詳細',
      viewMore: 'もっと見る',
      showLess: '閉じる',
    },
    note: {
      whatsHappening: 'いまどうしてる？',
      postNote: 'ノートを投稿',
      charactersRemaining: '残り文字数',
      addTags: 'タグを追加',
      addMedia: 'メディアを追加',
      createPoll: '投票を作成',
      scheduledPost: '予約投稿',
      draft: '下書き',
      published: '公開済み',
    },
    profile: {
      followers: 'フォロワー',
      following: 'フォロー中',
      notes: 'ノート',
      joined: '参加日',
      editProfile: 'プロフィールを編集',
      username: 'ユーザー名',
      bio: '自己紹介',
      website: 'ウェブサイト',
      location: '場所',
      badges: 'バッジ',
      statistics: '統計',
      activity: 'アクティビティ',
    },
    community: {
      create: 'コミュニティを作成',
      join: '参加',
      leave: '退出',
      members: 'メンバー',
      public: '公開',
      private: '非公開',
      description: '説明',
      rules: 'ルール',
      moderators: 'モデレーター',
    },
    rewards: {
      points: 'ポイント',
      earnings: '収益',
      claim: '請求',
      history: '履歴',
      rank: 'ランク',
      streak: '連続',
      achievements: '実績',
      totalEarned: '総収益',
    },
    settings: {
      account: 'アカウント',
      privacy: 'プライバシー',
      notifications: '通知',
      appearance: '外観',
      language: '言語',
      theme: 'テーマ',
      security: 'セキュリティ',
      wallet: 'ウォレット',
      premium: 'プレミアム',
    },
    time: {
      now: 'たった今',
      minuteAgo: '1分前',
      minutesAgo: '分前',
      hourAgo: '1時間前',
      hoursAgo: '時間前',
      dayAgo: '1日前',
      daysAgo: '日前',
      weekAgo: '1週間前',
      weeksAgo: '週間前',
      monthAgo: '1ヶ月前',
      monthsAgo: 'ヶ月前',
      yearAgo: '1年前',
      yearsAgo: '年前',
    },
    messages: {
      connectWallet: 'ウォレットを接続してください',
      transactionPending: 'トランザクション処理中...',
      transactionSuccess: 'トランザクション成功！',
      transactionFailed: 'トランザクション失敗',
      insufficientBalance: '残高不足',
      networkError: 'ネットワークエラー',
      postSuccess: 'ノートを投稿しました！',
      postFailed: 'ノートの投稿に失敗しました',
      followSuccess: 'フォローしました',
      unfollowSuccess: 'フォローを解除しました',
    },
  },

  ko: {
    nav: {
      home: '홈',
      explore: '탐색',
      communities: '커뮤니티',
      trending: '트렌드',
      leaderboard: '리더보드',
      rewards: '보상',
      bookmarks: '북마크',
      profile: '프로필',
      settings: '설정',
      notifications: '알림',
      search: '검색',
    },
    actions: {
      post: '게시',
      reply: '답글',
      like: '좋아요',
      repost: '리포스트',
      bookmark: '북마크',
      share: '공유',
      edit: '수정',
      delete: '삭제',
      report: '신고',
      follow: '팔로우',
      unfollow: '언팔로우',
      tip: '팁',
      subscribe: '구독',
      cancel: '취소',
      save: '저장',
      submit: '제출',
      close: '닫기',
      confirm: '확인',
    },
    common: {
      loading: '로딩 중...',
      error: '오류',
      success: '성공',
      warning: '경고',
      info: '정보',
      noData: '데이터 없음',
      tryAgain: '다시 시도',
      learnMore: '더 알아보기',
      viewMore: '더 보기',
      showLess: '접기',
    },
    note: {
      whatsHappening: '무슨 일이 일어나고 있나요?',
      postNote: '노트 게시',
      charactersRemaining: '남은 문자',
      addTags: '태그 추가',
      addMedia: '미디어 추가',
      createPoll: '투표 만들기',
      scheduledPost: '예약 게시',
      draft: '초안',
      published: '게시됨',
    },
    profile: {
      followers: '팔로워',
      following: '팔로잉',
      notes: '노트',
      joined: '가입일',
      editProfile: '프로필 수정',
      username: '사용자 이름',
      bio: '소개',
      website: '웹사이트',
      location: '위치',
      badges: '배지',
      statistics: '통계',
      activity: '활동',
    },
    community: {
      create: '커뮤니티 만들기',
      join: '참여',
      leave: '나가기',
      members: '멤버',
      public: '공개',
      private: '비공개',
      description: '설명',
      rules: '규칙',
      moderators: '관리자',
    },
    rewards: {
      points: '포인트',
      earnings: '수익',
      claim: '청구',
      history: '기록',
      rank: '순위',
      streak: '연속',
      achievements: '업적',
      totalEarned: '총 수익',
    },
    settings: {
      account: '계정',
      privacy: '개인정보',
      notifications: '알림',
      appearance: '외관',
      language: '언어',
      theme: '테마',
      security: '보안',
      wallet: '지갑',
      premium: '프리미엄',
    },
    time: {
      now: '방금',
      minuteAgo: '1분 전',
      minutesAgo: '분 전',
      hourAgo: '1시간 전',
      hoursAgo: '시간 전',
      dayAgo: '1일 전',
      daysAgo: '일 전',
      weekAgo: '1주 전',
      weeksAgo: '주 전',
      monthAgo: '1개월 전',
      monthsAgo: '개월 전',
      yearAgo: '1년 전',
      yearsAgo: '년 전',
    },
    messages: {
      connectWallet: '지갑을 연결해주세요',
      transactionPending: '트랜잭션 처리 중...',
      transactionSuccess: '트랜잭션 성공!',
      transactionFailed: '트랜잭션 실패',
      insufficientBalance: '잔액 부족',
      networkError: '네트워크 오류',
      postSuccess: '노트가 게시되었습니다!',
      postFailed: '노트 게시 실패',
      followSuccess: '팔로우 성공',
      unfollowSuccess: '언팔로우 성공',
    },
  },

  pt: {
    nav: {
      home: 'Início',
      explore: 'Explorar',
      communities: 'Comunidades',
      trending: 'Em Alta',
      leaderboard: 'Classificação',
      rewards: 'Recompensas',
      bookmarks: 'Favoritos',
      profile: 'Perfil',
      settings: 'Configurações',
      notifications: 'Notificações',
      search: 'Pesquisar',
    },
    actions: {
      post: 'Publicar',
      reply: 'Responder',
      like: 'Curtir',
      repost: 'Repostar',
      bookmark: 'Salvar',
      share: 'Compartilhar',
      edit: 'Editar',
      delete: 'Excluir',
      report: 'Denunciar',
      follow: 'Seguir',
      unfollow: 'Deixar de seguir',
      tip: 'Gorjeta',
      subscribe: 'Inscrever-se',
      cancel: 'Cancelar',
      save: 'Salvar',
      submit: 'Enviar',
      close: 'Fechar',
      confirm: 'Confirmar',
    },
    common: {
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      warning: 'Aviso',
      info: 'Informação',
      noData: 'Nenhum dado disponível',
      tryAgain: 'Tentar novamente',
      learnMore: 'Saiba mais',
      viewMore: 'Ver mais',
      showLess: 'Ver menos',
    },
    note: {
      whatsHappening: 'O que está acontecendo?',
      postNote: 'Publicar nota',
      charactersRemaining: 'caracteres restantes',
      addTags: 'Adicionar tags',
      addMedia: 'Adicionar mídia',
      createPoll: 'Criar enquete',
      scheduledPost: 'Publicação agendada',
      draft: 'Rascunho',
      published: 'Publicado',
    },
    profile: {
      followers: 'Seguidores',
      following: 'Seguindo',
      notes: 'Notas',
      joined: 'Entrou em',
      editProfile: 'Editar perfil',
      username: 'Nome de usuário',
      bio: 'Biografia',
      website: 'Website',
      location: 'Localização',
      badges: 'Distintivos',
      statistics: 'Estatísticas',
      activity: 'Atividade',
    },
    community: {
      create: 'Criar comunidade',
      join: 'Entrar',
      leave: 'Sair',
      members: 'Membros',
      public: 'Público',
      private: 'Privado',
      description: 'Descrição',
      rules: 'Regras',
      moderators: 'Moderadores',
    },
    rewards: {
      points: 'Pontos',
      earnings: 'Ganhos',
      claim: 'Reivindicar',
      history: 'Histórico',
      rank: 'Classificação',
      streak: 'Sequência',
      achievements: 'Conquistas',
      totalEarned: 'Total ganho',
    },
    settings: {
      account: 'Conta',
      privacy: 'Privacidade',
      notifications: 'Notificações',
      appearance: 'Aparência',
      language: 'Idioma',
      theme: 'Tema',
      security: 'Segurança',
      wallet: 'Carteira',
      premium: 'Premium',
    },
    time: {
      now: 'agora',
      minuteAgo: 'há 1 minuto',
      minutesAgo: 'minutos atrás',
      hourAgo: 'há 1 hora',
      hoursAgo: 'horas atrás',
      dayAgo: 'há 1 dia',
      daysAgo: 'dias atrás',
      weekAgo: 'há 1 semana',
      weeksAgo: 'semanas atrás',
      monthAgo: 'há 1 mês',
      monthsAgo: 'meses atrás',
      yearAgo: 'há 1 ano',
      yearsAgo: 'anos atrás',
    },
    messages: {
      connectWallet: 'Por favor, conecte sua carteira',
      transactionPending: 'Transação pendente...',
      transactionSuccess: 'Transação bem-sucedida!',
      transactionFailed: 'Transação falhou',
      insufficientBalance: 'Saldo insuficiente',
      networkError: 'Erro de rede',
      postSuccess: 'Nota publicada com sucesso!',
      postFailed: 'Falha ao publicar nota',
      followSuccess: 'Usuário seguido com sucesso',
      unfollowSuccess: 'Deixou de seguir o usuário',
    },
  },

  ar: {
    nav: {
      home: 'الرئيسية',
      explore: 'استكشاف',
      communities: 'المجتمعات',
      trending: 'الشائع',
      leaderboard: 'لوحة الصدارة',
      rewards: 'المكافآت',
      bookmarks: 'العلامات',
      profile: 'الملف الشخصي',
      settings: 'الإعدادات',
      notifications: 'الإشعارات',
      search: 'بحث',
    },
    actions: {
      post: 'نشر',
      reply: 'رد',
      like: 'إعجاب',
      repost: 'إعادة نشر',
      bookmark: 'حفظ',
      share: 'مشاركة',
      edit: 'تعديل',
      delete: 'حذف',
      report: 'بلاغ',
      follow: 'متابعة',
      unfollow: 'إلغاء المتابعة',
      tip: 'إكرامية',
      subscribe: 'اشتراك',
      cancel: 'إلغاء',
      save: 'حفظ',
      submit: 'إرسال',
      close: 'إغلاق',
      confirm: 'تأكيد',
    },
    common: {
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      warning: 'تحذير',
      info: 'معلومات',
      noData: 'لا توجد بيانات',
      tryAgain: 'حاول مجدداً',
      learnMore: 'اعرف المزيد',
      viewMore: 'عرض المزيد',
      showLess: 'عرض أقل',
    },
    note: {
      whatsHappening: 'ماذا يحدث؟',
      postNote: 'نشر ملاحظة',
      charactersRemaining: 'الأحرف المتبقية',
      addTags: 'إضافة وسوم',
      addMedia: 'إضافة وسائط',
      createPoll: 'إنشاء استطلاع',
      scheduledPost: 'منشور مجدول',
      draft: 'مسودة',
      published: 'منشور',
    },
    profile: {
      followers: 'المتابعون',
      following: 'يتابع',
      notes: 'ملاحظات',
      joined: 'انضم في',
      editProfile: 'تعديل الملف',
      username: 'اسم المستخدم',
      bio: 'السيرة الذاتية',
      website: 'الموقع',
      location: 'الموقع',
      badges: 'الشارات',
      statistics: 'الإحصائيات',
      activity: 'النشاط',
    },
    community: {
      create: 'إنشاء مجتمع',
      join: 'انضمام',
      leave: 'مغادرة',
      members: 'الأعضاء',
      public: 'عام',
      private: 'خاص',
      description: 'الوصف',
      rules: 'القواعد',
      moderators: 'المشرفون',
    },
    rewards: {
      points: 'النقاط',
      earnings: 'الأرباح',
      claim: 'مطالبة',
      history: 'السجل',
      rank: 'الترتيب',
      streak: 'التتابع',
      achievements: 'الإنجازات',
      totalEarned: 'إجمالي الأرباح',
    },
    settings: {
      account: 'الحساب',
      privacy: 'الخصوصية',
      notifications: 'الإشعارات',
      appearance: 'المظهر',
      language: 'اللغة',
      theme: 'المظهر',
      security: 'الأمان',
      wallet: 'المحفظة',
      premium: 'مميز',
    },
    time: {
      now: 'الآن',
      minuteAgo: 'منذ دقيقة',
      minutesAgo: 'منذ دقائق',
      hourAgo: 'منذ ساعة',
      hoursAgo: 'منذ ساعات',
      dayAgo: 'منذ يوم',
      daysAgo: 'منذ أيام',
      weekAgo: 'منذ أسبوع',
      weeksAgo: 'منذ أسابيع',
      monthAgo: 'منذ شهر',
      monthsAgo: 'منذ أشهر',
      yearAgo: 'منذ سنة',
      yearsAgo: 'منذ سنوات',
    },
    messages: {
      connectWallet: 'الرجاء توصيل المحفظة',
      transactionPending: 'المعاملة قيد الانتظار...',
      transactionSuccess: 'نجحت المعاملة!',
      transactionFailed: 'فشلت المعاملة',
      insufficientBalance: 'رصيد غير كافٍ',
      networkError: 'خطأ في الشبكة',
      postSuccess: 'تم نشر الملاحظة بنجاح!',
      postFailed: 'فشل نشر الملاحظة',
      followSuccess: 'تمت المتابعة بنجاح',
      unfollowSuccess: 'تم إلغاء المتابعة بنجاح',
    },
  },

  hi: {
    nav: {
      home: 'होम',
      explore: 'एक्सप्लोर',
      communities: 'समुदाय',
      trending: 'ट्रेंडिंग',
      leaderboard: 'लीडरबोर्ड',
      rewards: 'पुरस्कार',
      bookmarks: 'बुकमार्क',
      profile: 'प्रोफ़ाइल',
      settings: 'सेटिंग्स',
      notifications: 'सूचनाएं',
      search: 'खोजें',
    },
    actions: {
      post: 'पोस्ट',
      reply: 'जवाब',
      like: 'पसंद',
      repost: 'रीपोस्ट',
      bookmark: 'बुकमार्क',
      share: 'शेयर',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      report: 'रिपोर्ट',
      follow: 'फॉलो',
      unfollow: 'अनफॉलो',
      tip: 'टिप',
      subscribe: 'सब्सक्राइब',
      cancel: 'रद्द करें',
      save: 'सेव करें',
      submit: 'सबमिट',
      close: 'बंद करें',
      confirm: 'पुष्टि करें',
    },
    common: {
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      warning: 'चेतावनी',
      info: 'जानकारी',
      noData: 'कोई डेटा नहीं',
      tryAgain: 'फिर कोशिश करें',
      learnMore: 'और जानें',
      viewMore: 'और देखें',
      showLess: 'कम दिखाएं',
    },
    note: {
      whatsHappening: 'क्या हो रहा है?',
      postNote: 'नोट पोस्ट करें',
      charactersRemaining: 'अक्षर शेष',
      addTags: 'टैग जोड़ें',
      addMedia: 'मीडिया जोड़ें',
      createPoll: 'पोल बनाएं',
      scheduledPost: 'निर्धारित पोस्ट',
      draft: 'ड्राफ्ट',
      published: 'प्रकाशित',
    },
    profile: {
      followers: 'फॉलोअर्स',
      following: 'फॉलोइंग',
      notes: 'नोट्स',
      joined: 'शामिल हुए',
      editProfile: 'प्रोफ़ाइल संपादित करें',
      username: 'यूजरनेम',
      bio: 'बायो',
      website: 'वेबसाइट',
      location: 'स्थान',
      badges: 'बैज',
      statistics: 'आंकड़े',
      activity: 'गतिविधि',
    },
    community: {
      create: 'समुदाय बनाएं',
      join: 'शामिल हों',
      leave: 'छोड़ें',
      members: 'सदस्य',
      public: 'सार्वजनिक',
      private: 'निजी',
      description: 'विवरण',
      rules: 'नियम',
      moderators: 'मॉडरेटर',
    },
    rewards: {
      points: 'अंक',
      earnings: 'कमाई',
      claim: 'दावा करें',
      history: 'इतिहास',
      rank: 'रैंक',
      streak: 'स्ट्रीक',
      achievements: 'उपलब्धियां',
      totalEarned: 'कुल अर्जित',
    },
    settings: {
      account: 'खाता',
      privacy: 'गोपनीयता',
      notifications: 'सूचनाएं',
      appearance: 'दिखावट',
      language: 'भाषा',
      theme: 'थीम',
      security: 'सुरक्षा',
      wallet: 'वॉलेट',
      premium: 'प्रीमियम',
    },
    time: {
      now: 'अभी',
      minuteAgo: '1 मिनट पहले',
      minutesAgo: 'मिनट पहले',
      hourAgo: '1 घंटा पहले',
      hoursAgo: 'घंटे पहले',
      dayAgo: '1 दिन पहले',
      daysAgo: 'दिन पहले',
      weekAgo: '1 सप्ताह पहले',
      weeksAgo: 'सप्ताह पहले',
      monthAgo: '1 महीना पहले',
      monthsAgo: 'महीने पहले',
      yearAgo: '1 साल पहले',
      yearsAgo: 'साल पहले',
    },
    messages: {
      connectWallet: 'कृपया अपना वॉलेट कनेक्ट करें',
      transactionPending: 'लेन-देन लंबित...',
      transactionSuccess: 'लेन-देन सफल!',
      transactionFailed: 'लेन-देन विफल',
      insufficientBalance: 'अपर्याप्त बैलेंस',
      networkError: 'नेटवर्क त्रुटि',
      postSuccess: 'नोट सफलतापूर्वक पोस्ट किया गया!',
      postFailed: 'नोट पोस्ट करना विफल',
      followSuccess: 'सफलतापूर्वक फॉलो किया',
      unfollowSuccess: 'सफलतापूर्वक अनफॉलो किया',
    },
  },
};

// Get translations for a language
export function getTranslations(language: Language): Translations {
  return translations[language] || translations.en;
}

// Get available languages
export function getAvailableLanguages(): Array<{ code: Language; name: string; flag: string }> {
  return [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  ];
}

// Format relative time
export function formatRelativeTime(timestamp: Date, language: Language): string {
  const t = getTranslations(language).time;
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return t.now;
  if (minutes === 1) return t.minuteAgo;
  if (minutes < 60) return `${minutes} ${t.minutesAgo}`;
  if (hours === 1) return t.hourAgo;
  if (hours < 24) return `${hours} ${t.hoursAgo}`;
  if (days === 1) return t.dayAgo;
  if (days < 7) return `${days} ${t.daysAgo}`;
  if (weeks === 1) return t.weekAgo;
  if (weeks < 4) return `${weeks} ${t.weeksAgo}`;
  if (months === 1) return t.monthAgo;
  if (months < 12) return `${months} ${t.monthsAgo}`;
  if (years === 1) return t.yearAgo;
  return `${years} ${t.yearsAgo}`;
}

