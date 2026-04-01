-- ============================================================
-- Kudip — Supabase 초기화 DDL
-- Supabase SQL Editor에 전체 붙여넣기 후 실행
-- ============================================================

-- users
CREATE TABLE IF NOT EXISTS users (
    id             BIGSERIAL PRIMARY KEY,
    email          VARCHAR(255) NOT NULL UNIQUE,
    nickname       VARCHAR(50)  NOT NULL,
    password_hash  TEXT         NOT NULL,
    created_at     TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP    NOT NULL DEFAULT now()
);

-- recipes
CREATE TABLE IF NOT EXISTS recipes (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    category    VARCHAR(20)  NOT NULL CHECK (category IN ('KOREAN','WESTERN','JAPANESE','CHINESE','OTHER')),
    created_at  TIMESTAMP   NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP   NOT NULL DEFAULT now()
);

-- cooking_logs
CREATE TABLE IF NOT EXISTS cooking_logs (
    id                 BIGSERIAL PRIMARY KEY,
    recipe_id          BIGINT      NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    cooked_at          DATE,
    time_slot          VARCHAR(10) NOT NULL CHECK (time_slot IN ('MORNING','LUNCH','DINNER','NONE')),
    cook_time_minutes  INTEGER,
    recipe_memo        TEXT,
    process_memo       TEXT,
    rating             INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
    diary              TEXT,
    created_at         TIMESTAMP   NOT NULL DEFAULT now(),
    updated_at         TIMESTAMP   NOT NULL DEFAULT now()
);

-- ingredients
CREATE TABLE IF NOT EXISTS ingredients (
    id    BIGSERIAL PRIMARY KEY,
    name  VARCHAR(100) NOT NULL UNIQUE
);

-- cooking_log_ingredients
CREATE TABLE IF NOT EXISTS cooking_log_ingredients (
    id              BIGSERIAL PRIMARY KEY,
    cooking_log_id  BIGINT      NOT NULL REFERENCES cooking_logs(id) ON DELETE CASCADE,
    ingredient_id   BIGINT      NOT NULL REFERENCES ingredients(id),
    quantity        VARCHAR(50)
);

-- cooking_log_images
CREATE TABLE IF NOT EXISTS cooking_log_images (
    id              BIGSERIAL PRIMARY KEY,
    cooking_log_id  BIGINT    NOT NULL REFERENCES cooking_logs(id) ON DELETE CASCADE,
    image_url       TEXT      NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

-- updated_at 자동 갱신 트리거 (Supabase/PostgreSQL용)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_cooking_logs_updated_at
    BEFORE UPDATE ON cooking_logs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_cooking_log_images_updated_at
    BEFORE UPDATE ON cooking_log_images
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
