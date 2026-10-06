CREATE OR REPLACE FUNCTION set_modified_at()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.modified_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER activity_set_modified_at
    BEFORE UPDATE
    ON somnilingua.activity
    FOR EACH ROW
EXECUTE FUNCTION set_modified_at();
