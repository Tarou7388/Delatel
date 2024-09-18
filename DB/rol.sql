USE Delatel;

DELIMITER $$

CREATE PROCEDURE spu_roles_actualizar(
		p_id_rol INT,
    p_rol VARCHAR(30),
    p_iduser_update INT
  )
  BEGIN
	UPDATE tb_roles
      SET 
			rol = p_rol,
      iduser_update = p_iduser_update,
      update_at = NOW()
		WHERE
			id_rol = p_id_rol;
    END $$

DELIMITER $$

CREATE PROCEDURE spu_roles_inhabilitar(
	  p_id_rol INT,
    p_iduser_inactive INT
  )
  BEGIN 
	UPDATE tb_roles
    SET
		inactive_at = NOW(),
    iduser_inactive = p_iduser_inactive
	WHERE
		id_rol = p_id_rol;
END $$