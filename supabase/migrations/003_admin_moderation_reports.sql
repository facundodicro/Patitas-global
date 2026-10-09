-- 003_admin_moderation_reports.sql
-- Moderación: el administrador puede editar o eliminar CUALQUIER reporte,
-- incluso los publicados por otros usuarios (p. ej. contenido inapropiado).
-- El dueño sigue pudiendo gestionar los suyos, como antes.

drop policy if exists "update_reportante_reports" on reports;
create policy "update_reportante_reports"
  on reports for update
  using (
    reporter_id = auth.uid()
    or reporter_id is null
    or (auth.jwt() ->> 'email') in (
      'facundodicroe76@gmail.com',
      'facundodicroce76@gmail.com'
    )
  );

drop policy if exists "delete_reportante_reports" on reports;
create policy "delete_reportante_reports"
  on reports for delete
  using (
    reporter_id = auth.uid()
    or reporter_id is null
    or (auth.jwt() ->> 'email') in (
      'facundodicroe76@gmail.com',
      'facundodicroce76@gmail.com'
    )
  );
