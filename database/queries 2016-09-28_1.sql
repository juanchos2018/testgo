/* Crear la tabla para los movimientos de mercaderia */
CREATE TABLE transfers
(
    id serial NOT NULL,
    code character varying(10) NOT NULL,
    total_qty integer,
    transfer_date date,
    branch_detail_origin_id integer,
    branch_detail_target_id integer,
    shuttle_reason_id integer,
    registered_at timestamp without time zone NOT NULL DEFAULT now(),
    registered_by integer NOT NULL,
    approved_state approved_state_type NOT NULL DEFAULT 'PENDIENTE'::approved_state_type,
    approved_at timestamp without time zone,
    approved_by integer,
    CONSTRAINT pk_transfer_id PRIMARY KEY (id),
	CONSTRAINT fk_transfers_branch_detail_origin_id FOREIGN KEY (branch_detail_origin_id)
		REFERENCES branch_details (id) MATCH SIMPLE
		ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT fk_transfers_branch_detail_target_id FOREIGN KEY (branch_detail_target_id)
		REFERENCES branch_details (id) MATCH SIMPLE
		ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_transfers_shuttle_reason_id FOREIGN KEY (shuttle_reason_id)
        REFERENCES shuttle_reasons (id) MATCH SIMPLE
        ON UPDATE CASCADE ON DELETE CASCADE
);
